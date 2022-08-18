import React, { useEffect, useState } from "react";
import { EditorState } from "draft-js";
import { useCombobox, UseComboboxStateChange } from "downshift";

import Icon from "../../Icon";
import { getControlDescription, getControlLabel } from "../../../api/ui";
import { CommandCategory, CommandControl } from "../../../api/types";
import findMatches from "./findMatches";

export type CommandStateChange = UseComboboxStateChange<CommandControl>;

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  inputValue?: string;
  items: CommandCategory[];
  onSelect: (change: CommandStateChange) => void;
  getEditorState: () => EditorState;
  noResultsText?: string;
}

export default function ComboBox({
  label,
  placeholder,
  inputValue,
  items,
  onSelect,
  noResultsText,
  getEditorState,
}: ComboBoxProps) {
  const flatItems = items.flatMap<CommandControl>(
    (category) => category.items || [],
  );
  const [inputItems, setInputItems] = useState<CommandControl[]>(flatItems);
  const noResults = inputItems.length === 0;
  const {
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    setHighlightedIndex,
    setInputValue,
    openMenu,
  } = useCombobox<CommandControl>({
    ...(typeof inputValue !== "undefined" && { inputValue }),
    initialInputValue: inputValue || "",
    items: inputItems,
    itemToString(item: CommandControl | null) {
      if (!item) {
        return "";
      }

      return (
        getControlDescription(item) || getControlLabel(item.type, item) || ""
      );
    },
    selectedItem: null,

    onSelectedItemChange: onSelect,

    onInputValueChange: (changes) => {
      const { inputValue: val } = changes;
      if (!val) {
        setInputItems(flatItems);
        return;
      }

      const filtered = findMatches<CommandControl>(flatItems, val);
      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    },
  });

  useEffect(() => {
    if (inputValue) {
      openMenu();
      setInputValue(inputValue);
      const filtered = findMatches<CommandControl>(flatItems, inputValue);
      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    } else {
      setInputValue("");
      setInputItems(flatItems);
      setHighlightedIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <div
      className={`Draftail-ComboBox Draftail-ComboBox--${
        label ? "field" : "contenteditable"
      }`}
    >
      <label className="Draftail-ComboBox__label" {...getLabelProps()}>
        {label}
      </label>
      <div {...getComboboxProps()}>
        <input
          data-draftail-command-palette-input
          type="text"
          {...getInputProps()}
          placeholder={placeholder}
        />
      </div>
      {noResults ? (
        <div className="Draftail-ComboBox__status">{noResultsText}</div>
      ) : null}
      <div {...getMenuProps()} className="Draftail-ComboBox__menu">
        {items.map((category) => {
          const categoryItems = (category.items || []).filter((item) =>
            inputItems.find((i) => i.type === item.type),
          );

          if (categoryItems.length === 0) {
            return null;
          }

          return (
            <div className="Draftail-ComboBox__optgroup" key={category.type}>
              {category.label ? (
                <div className="Draftail-ComboBox__optgroup-label">
                  {category.label}
                </div>
              ) : null}
              {categoryItems.map((item, index) => {
                const itemLabel = getControlLabel(item.type, item);
                const description = getControlDescription(item);
                const hasIcon =
                  typeof item.icon !== "undefined" && item.icon !== null;

                return (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${itemLabel}${item.type}${index}`}
                    {...getItemProps({
                      item,
                      index: inputItems.findIndex((i) => i.type === item.type),
                    })}
                    onMouseDown={(e) => {
                      // Side-step Downshift event handling and trigger selection on mouse down for clicks,
                      // so we preserve keyboard focus within the editor for the command palette.
                      onSelect({ selectedItem: item } as CommandStateChange);
                      e.stopPropagation();
                    }}
                    className="Draftail-ComboBox__option"
                  >
                    <div className="Draftail-ComboBox__option-icon">
                      {hasIcon ? <Icon icon={item!.icon} /> : null}
                      {itemLabel && !hasIcon ? <span>{itemLabel}</span> : null}
                    </div>
                    {item.render ? (
                      item.render({
                        option: item,
                        getEditorState,
                      })
                    ) : (
                      <div className="Draftail-ComboBox__option-text">
                        {description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
