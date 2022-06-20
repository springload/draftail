import React, { useEffect, useState } from "react";
import { useCombobox, UseComboboxStateChange } from "downshift";

import Icon, { IconProp } from "../../Icon";
import { getControlDescription, getControlLabel } from "../../../api/ui";

export interface ComboBoxOption {
  type: string;
  label?: string | null;
  description?: string;
  icon?: IconProp;
}

interface ComboBoxProps {
  label: string;
  placeholder: string;
  items: ComboBoxOption[];
  selectedItem: ComboBoxOption;
  handleSelectedItemChange: (
    changes: UseComboboxStateChange<ComboBoxOption>,
  ) => void;
}

export default function ComboBox({
  label,
  placeholder,
  items,
  selectedItem,
  handleSelectedItemChange,
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
    itemToString(item) {
      return item ? getControlDescription(item) : "";
    },
    selectedItem: null,
    onSelectedItemChange: (selection) => {
      handleSelectedItemChange(selection);
      // reset();
      // console.log("items.length", items.length);
      // setInputItems(items);
      // reset();
      // selectItem(null);
    },
    // onStateChange: (changes) => {
    //   console.log(changes);
    // },
    onInputValueChange: (changes) => {
      const { inputValue } = changes;
      console.log(changes);
      // console.log("onInputValueChange");
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
      setHighlightedIndex(0);
    },
  });

  return (
    <div className="Draftail-ComboBox">
      <label className="Draftail-ComboBox__label" {...getLabelProps()}>
        {label}
      </label>
      <div {...getComboboxProps()}>
        <input {...getInputProps()} placeholder={placeholder} />
      </div>
      <div {...getMenuProps()}>
        {inputItems.map((item, index) => {
          const label = getControlLabel(item.type, item);
          return (
            <div key={`${item}${index}`} {...getItemProps({ item, index })}>
              <div className="Draftail-ComboBox__option-icon">
                {typeof item.icon !== "undefined" && item.icon !== null ? (
                  <Icon icon={item!.icon} />
                ) : null}
                {label ? <span>{label}</span> : null}
              </div>
              <div className="Draftail-ComboBox__option-text">
                {getControlDescription(item)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
