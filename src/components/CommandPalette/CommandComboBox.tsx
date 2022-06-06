import React, { Component, useState, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { useCombobox } from "downshift";
import { getVisibleSelectionRect } from "draft-js";

import ToolbarButton from "../Toolbar/ToolbarButton";
import DraftUtils from "../../api/DraftUtils";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

const CommandComboBox = ({
  textDirectionality,
  blockTypes,
  match,
  getEditorState,
}) => {
  const commands = blockTypes;
  const [inputItems, setInputItems] = useState(commands);
  const tippyParentRef = useRef(null);
  const [selectionRect, setSelectionRect] = useState();

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.isCollapsed();

  useEffect(() => {
    if (isCollapsed) {
      setSelectionRect(getReferenceClientRect());
    } else {
      setSelectionRect(null);
    }
  }, [isCollapsed]);

  const isVisible = isCollapsed && Boolean(selectionRect);

  const {
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    selectedItem: match,
    onSelectedItemChange: (selection) => {
      console.log(selection);
    },
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        inputItems.filter((item) =>
          item.type.toLowerCase().startsWith(inputValue?.toLowerCase()),
        ),
      );
    },
  });

  return (
    <div>
      {isVisible ? (
        <Tippy
          visible={isVisible}
          getReferenceClientRect={() => selectionRect}
          maxWidth="100%"
          interactive
          appendTo={() => tippyParentRef.current}
          content={
            <>
              <div {...getComboboxProps()}>
                <input {...getInputProps()} />
              </div>
              <div {...getMenuProps()}>
                {inputItems.map((item, index) => (
                  <div
                    style={
                      highlightedIndex === index
                        ? { backgroundColor: "#bde4ff" }
                        : {}
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
            </>
          }
        />
      ) : null}
      <div ref={tippyParentRef} />
    </div>
  );
};

export default CommandComboBox;
