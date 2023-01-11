import React, { useContext, useMemo, useState } from "react";

import { Control } from "../../api/types";

import Toolbar, { ToolbarProps } from "./Toolbar";
import ToolbarButton from "./ToolbarButton";
import FloatingToolbar from "./FloatingToolbar/FloatingToolbar";

type ToolbarType = "floating" | "sticky";

interface PinButton extends Control {
  floatingLabel?: Control["label"];
  stickyLabel?: Control["label"];
  floatingDescription?: Control["description"];
  stickyDescription?: Control["description"];
  floatingIcon?: Control["icon"];
  stickyIcon?: Control["icon"];
}

const ToolbarContext = React.createContext<{
  pinButton: PinButton;
  toolbar: ToolbarType;
  setToolbar: (type: ToolbarType) => void;
}>({ pinButton: {}, toolbar: "sticky", setToolbar: () => {} });

const ToolbarPinButton = () => {
  const { pinButton, toolbar, setToolbar } = useContext(ToolbarContext);
  const label =
    toolbar === "floating"
      ? pinButton.floatingLabel || "↗"
      : pinButton.stickyLabel || "↙";
  const description =
    toolbar === "floating"
      ? pinButton.floatingDescription
      : pinButton.stickyDescription;
  const icon =
    toolbar === "floating" ? pinButton.floatingIcon : pinButton.stickyIcon;
  return (
    <ToolbarButton
      name={pinButton.type || "PIN_TOOLBAR"}
      className="Draftail-ToolbarButton--pin"
      tooltipDirection="down"
      title={description || pinButton.description}
      icon={icon || pinButton.icon}
      label={icon || pinButton.icon ? null : label}
      onClick={setToolbar.bind(
        null,
        toolbar === "floating" ? "sticky" : "floating",
      )}
      active={false}
    />
  );
};

const pinControls = [
  {
    inline: () => <ToolbarPinButton />,
  },
];

export interface InlineToolbarProps extends ToolbarProps {
  pinButton?: PinButton;
  defaultToolbar?: ToolbarType;
  onSetToolbar?: (toolbar: ToolbarType, callback: () => void) => void;
}

const InlineToolbar = ({
  pinButton = {},
  defaultToolbar = "floating",
  onSetToolbar,
  controls,
  ...otherProps
}: InlineToolbarProps) => {
  const [toolbar, setToolbar] = useState(defaultToolbar);
  const ctx = useMemo(
    () => ({
      pinButton,
      toolbar,
      setToolbar: (val: ToolbarType) => {
        if (onSetToolbar) {
          onSetToolbar(val, () => {
            setToolbar(val);
          });
        } else {
          setToolbar(val);
        }
      },
    }),
    [pinButton, toolbar, setToolbar, onSetToolbar],
  );
  const ToolbarComponent = toolbar === "floating" ? FloatingToolbar : Toolbar;

  return (
    <ToolbarContext.Provider value={ctx}>
      <ToolbarComponent
        controls={controls.concat(pinControls)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />
    </ToolbarContext.Provider>
  );
};

export default InlineToolbar;
