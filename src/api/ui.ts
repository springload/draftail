import { DESCRIPTIONS, LABELS } from "./constants";

export const getControlLabel = (
  type: string,
  config: boolean | ControlProp,
) => {
  const icon = typeof config === "boolean" ? undefined : config.icon;

  if (typeof config.label === "string" || config.label === null) {
    return config.label;
  }

  if (typeof icon !== "undefined") {
    return null;
  }

  return LABELS[type];
};

export const getControlDescription = (control: {
  type?: string;
  label?: string;
  description?: string;
}) => {
  const useDefaultDescription = typeof control.description === "undefined";
  const defaultDescription = DESCRIPTIONS[control.type];
  const description = useDefaultDescription
    ? defaultDescription
    : control.description;
  const useDefaultLabel = typeof control.label === "undefined";
  const defaultLabel = LABELS[control.type];
  const label = useDefaultLabel ? defaultLabel : control.label;

  return description || label;
};
