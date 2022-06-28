import React, { useEffect, useState } from "react";
import { useCombobox, UseComboboxStateChange } from "downshift";

import Icon from "../../Icon";
import { getControlDescription, getControlLabel } from "../../../api/ui";
import { CommandCategory, CommandControl } from "../../../api/types";
import findMatches from "./findMatches";

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  inputValue?: string;
  items: CommandCategory[];
  onSelect: (change: UseComboboxStateChange<CommandControl>) => void;
  noResultsText?: string;
}

export default function ComboBox({
  label,
  placeholder,
  inputValue,
  items,
  onSelect,
  noResultsText,
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
    inputValue,
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
          value=""
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

                return (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${itemLabel}${item.type}${index}`}
                    {...getItemProps({
                      item,
                      index: inputItems.findIndex((i) => i.type === item.type),
                    })}
                    className="Draftail-ComboBox__option"
                  >
                    <div className="Draftail-ComboBox__option-icon">
                      {typeof item.icon !== "undefined" &&
                      item.icon !== null ? (
                        <Icon icon={item!.icon} />
                      ) : null}
                      {itemLabel ? <span>{itemLabel}</span> : null}
                    </div>
                    <div className="Draftail-ComboBox__option-text">
                      {description}
                    </div>
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
