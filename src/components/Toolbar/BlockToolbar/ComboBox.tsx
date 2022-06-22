import React, { useEffect, useState } from "react";
import { useCombobox } from "downshift";
import { EditorState } from "draft-js";

import Icon from "../../Icon";
import { getControlDescription, getControlLabel } from "../../../api/ui";
import { IconProp } from "../../../api/types";
import findMatches from "./findMatches";

export interface ComboBoxOption {
  type?: string;
  label?: string | null;
  description?: string | null;
  icon?: IconProp;
  onSelect: () => void;
}

interface ComboBoxProps {
  label: string;
  placeholder: string;
  inputValue?: string;
  items: ComboBoxOption[];
  selectedItem: ComboBoxOption;
  onSelect: () => EditorState;
}

export default function ComboBox({
  label,
  placeholder,
  inputValue,
  items,
  onSelect,
}: ComboBoxProps) {
  const [inputItems, setInputItems] = useState<ComboBoxOption[]>(items);
  const {
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    setHighlightedIndex,
    setInputValue,
    openMenu,
  } = useCombobox<ComboBoxOption>({
    inputValue,
    items: inputItems,
    itemToString(item: ComboBoxOption | null) {
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
      const { inputValue } = changes;
      if (!inputValue) {
        setInputItems(items);
        return;
      }

      const filtered = findMatches<ComboBoxOption>(items, inputValue);
      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    },
  });

  useEffect(() => {
    if (inputValue) {
      openMenu();
      setInputValue(inputValue);
      const filtered = findMatches<ComboBoxOption>(items, inputValue);
      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    } else {
      setInputValue("");
      setInputItems(items);
      setHighlightedIndex(-1);
    }
  }, [inputValue]);

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
          {...getInputProps()}
          placeholder={placeholder}
        />
      </div>
      <div {...getMenuProps()}>
        {inputItems.map((item, index) => {
          const label = getControlLabel(item.type, item);
          const description = getControlDescription(item);

          return (
            <div
              key={`${label}${item.type}${index}`}
              {...getItemProps({ item, index })}
            >
              <div className="Draftail-ComboBox__option-icon">
                {typeof item.icon !== "undefined" && item.icon !== null ? (
                  <Icon icon={item!.icon} />
                ) : null}
                {label ? <span>{label}</span> : null}
              </div>
              <div className="Draftail-ComboBox__option-text">
                {description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
