import React, { useState } from "react";
import { useCombobox, UseComboboxStateChange } from "downshift";

import Icon from "../../Icon";
import { getControlDescription, getControlLabel } from "../../../api/ui";
import { IconProp } from "../../../api/types";

export interface ComboBoxOption {
  type?: string;
  label?: string;
  description?: string;
  icon?: IconProp;
}

interface ComboBoxProps {
  label: string;
  placeholder: string;
  items: ComboBoxOption[];
  selectedItem: ComboBoxOption;
  onSelect: (changes: UseComboboxStateChange<ComboBoxOption>) => void;
}

export default function ComboBox({
  label,
  placeholder,
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
    reset,
    selectItem,
    setHighlightedIndex,
  } = useCombobox<ComboBoxOption>({
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

      const input = inputValue.toLowerCase();
      const filtered = items.filter((item) => {
        const label = getControlLabel(item.type, item);
        if (label) {
          const matchLabel = label.toLowerCase().startsWith(input);
          if (matchLabel) {
            return matchLabel;
          }
        }

        const description = getControlDescription(item);
        if (description) {
          return description.toLowerCase().startsWith(input);
        }
      });

      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    },
  });

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
        <input {...getInputProps()} placeholder={placeholder} />
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
