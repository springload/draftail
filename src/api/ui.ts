import { DESCRIPTIONS, KnownFormatType, LABELS } from "./constants";
import { BoolControl, Control } from "./types";

export const getControlLabel = (
  type: string | undefined,
  config: BoolControl,
) => {
  const predefinedType = type as KnownFormatType;

  if (typeof config === "boolean") {
    return LABELS[predefinedType];
  }

  if (typeof config.label === "string" || config.label === null) {
    return config.label;
  }

  if (typeof config.icon !== "undefined") {
    return null;
  }

  return LABELS[predefinedType];
};

export const getControlDescription = (control: Control) => {
  const predefinedType = control.type as KnownFormatType;
  const useDefaultDescription = typeof control.description === "undefined";
  const defaultDescription = DESCRIPTIONS[predefinedType];
  const description = useDefaultDescription
    ? defaultDescription
    : control.description;
  const useDefaultLabel = typeof control.label === "undefined";
  const defaultLabel = LABELS[predefinedType];
  const label = useDefaultLabel ? defaultLabel : control.label;

  return description || label;
};
