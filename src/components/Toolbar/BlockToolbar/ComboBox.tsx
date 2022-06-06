import React, { useState } from "react";
import { useCombobox } from "downshift";

import ToolbarButton from "../ToolbarButton";

export default function DropdownCombobox({
  items,
  selectedItem,
  handleSelectedItemChange,
}) {
  const [inputItems, setInputItems] = useState(items);
  const {
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    selectedItem,
    onSelectedItemChange: (selection) => {
      handleSelectedItemChange(selection);
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) =>
          item.title.toLowerCase().startsWith(inputValue.toLowerCase()),
        ),
      );
    },
  });
  return (
    <div>
      <label {...getLabelProps()} style={{ visibility: "hidden" }}>
        Choose an element:
      </label>
      <div {...getComboboxProps()}>
        <input {...getInputProps()} />
      </div>
      <div {...getMenuProps()}>
        {inputItems.map((item, index) => (
          <div
            style={
              highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
            }
            key={`${item}${index}`}
            {...getItemProps({ item, index })}
          >
            <ToolbarButton
              key={item.key}
              name={item.name}
              active={item.active}
              label={item.label}
              title={item.title}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
