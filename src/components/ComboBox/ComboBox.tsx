import React, { useEffect, useState } from "react";
import { useCombobox, UseComboboxStateChange } from "downshift";

import Icon, { IconProp } from "../Icon";
import findMatches from "./findMatches";

export interface ComboBoxCategory<ItemType> {
  type: string;
  label: string | null;
  items?: ItemType[];
}

export interface ComboBoxItem {
  type?: string;
  label?: string | null;
  description?: string | null;
  icon?: IconProp;
  category?: string;
  render?: (props: { option: ComboBoxItem }) => JSX.Element;
}

export { UseComboboxStateChange };

export type ComboBoxStateChange = UseComboboxStateChange<ComboBoxItem>;

export interface ComboBoxProps<ComboBoxOption> {
  label?: string;
  placeholder?: string;
  inputValue?: string;
  items: ComboBoxCategory<ComboBoxOption>[];
  getItemLabel: (
    type: string | undefined,
    item: ComboBoxOption,
  ) => string | null;
  getItemDescription: (item: ComboBoxOption) => string | null | undefined;
  getSearchFields: (item: ComboBoxOption) => string[];
  onSelect: (change: UseComboboxStateChange<ComboBoxOption>) => void;
  noResultsText?: string;
}

/**
 * A generic ComboBox component, intended to be reusable outside of Draftail.
 */
export default function ComboBox<ComboBoxOption extends ComboBoxItem>({
  label,
  placeholder,
  inputValue,
  items,
  getItemLabel,
  getItemDescription,
  getSearchFields,
  onSelect,
  noResultsText,
}: ComboBoxProps<ComboBoxOption>) {
  // If there is no label defined, assume the editor serves as the input field.
  const inlineCombobox = !label;
  const flatItems = items.flatMap<ComboBoxOption>(
    (category) => category.items || [],
  );
  const [inputItems, setInputItems] = useState<ComboBoxOption[]>(flatItems);
  const noResults = inputItems.length === 0;
  const {
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    setHighlightedIndex,
    setInputValue,
    openMenu,
  } = useCombobox<ComboBoxOption>({
    ...(typeof inputValue !== "undefined" && { inputValue }),
    initialInputValue: inputValue || "",
    items: inputItems,
    itemToString(item: ComboBoxOption | null) {
      if (!item) {
        return "";
      }

      return getItemDescription(item) || getItemLabel(item.type, item) || "";
    },
    selectedItem: null,

    onSelectedItemChange: onSelect,

    onInputValueChange: (changes) => {
      const { inputValue: val } = changes;
      if (!val) {
        setInputItems(flatItems);
        return;
      }

      const filtered = findMatches<ComboBoxOption>(
        flatItems,
        getSearchFields,
        val,
      );
      setInputItems(filtered);
      // Always reset the first item to highlighted on filtering, to speed up selection.
      setHighlightedIndex(0);
    },
  });

  useEffect(() => {
    if (inputValue) {
      openMenu();
      setInputValue(inputValue);
      const filtered = findMatches<ComboBoxOption>(
        flatItems,
        getSearchFields,
        inputValue,
      );
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
        inlineCombobox ? "inline" : "field"
      }`}
    >
      <label className="Draftail-ComboBox__label" {...getLabelProps()}>
        {label}
      </label>
      <div className="Draftail-ComboBox__field">
        <input
          type="text"
          {...getInputProps()}
          // Prevent the field from receiving focus if it’s not visible.
          disabled={inlineCombobox}
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
                const itemLabel = getItemLabel(item.type, item);
                const description = getItemDescription(item);
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
                      onSelect({
                        selectedItem: item,
                      } as UseComboboxStateChange<ComboBoxOption>);
                      e.stopPropagation();
                    }}
                    className="Draftail-ComboBox__option"
                  >
                    <div className="Draftail-ComboBox__option-icon">
                      {hasIcon ? <Icon icon={item!.icon} /> : null}
                      {itemLabel && !hasIcon ? <span>{itemLabel}</span> : null}
                    </div>
                    {item.render ? (
                      item.render({ option: item })
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
