import { DESCRIPTIONS, KnownFormatType, LABELS } from "../../../api/constants";
import { Control } from "../../../api/types";

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator.
const collator = new Intl.Collator(undefined, {
  usage: "search",
  sensitivity: "base",
  ignorePunctuation: true,
});

/**
 * See https://github.com/adobe/react-spectrum/blob/70e769acf639fc4ef3a704cb8fad81349cb4137a/packages/%40react-aria/i18n/src/useFilter.ts#L57.
 * See also https://github.com/arty-name/locale-index-of,
 * and https://github.com/tc39/ecma402/issues/506.
 */
const contains = (string: string, substring: string) => {
  if (substring.length === 0) {
    return true;
  }

  string = string.normalize("NFC");
  substring = substring.normalize("NFC");

  let scan = 0;
  let sliceLen = substring.length;
  for (; scan + sliceLen <= string.length; scan++) {
    let slice = string.slice(scan, scan + sliceLen);
    if (collator.compare(substring, slice) === 0) {
      return true;
    }
  }

  return false;
};

/**
 * Find all items where the label or description matches the inputValue.
 */
const findMatches = <T extends Control>(items: T[], input: string) => {
  return items.filter((item) => {
    const matches = [
      item.label,
      item.description,
      item.type ? LABELS[item.type as KnownFormatType] : "",
      item.type ? DESCRIPTIONS[item.type as KnownFormatType] : "",
      item.type,
    ];

    return matches.some((match) => match && contains(match, input));
  });
};

export default findMatches;
