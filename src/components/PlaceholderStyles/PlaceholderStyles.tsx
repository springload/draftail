import React from "react";
import { BLOCK_TYPE } from "../../api/constants";
import { BlockTypeControl } from "../../api/types";
import { getControlDescription } from "../../api/ui";

interface PlaceholderStylesProps {
  blockKey: string | null;
  blockTypes: ReadonlyArray<BlockTypeControl>;
  placeholder?: string | null;
}

/**
 * Adds placeholder "Write here…" text to the currently-focused block, and to empty non-list-item blocks.
 * Done with CSS so this can switch blocks without re-rendering the whole editor.
 */
function Styles({ blockKey, blockTypes, placeholder }: PlaceholderStylesProps) {
  let placeholderStyle = "";
  if (blockKey && placeholder) {
    placeholderStyle = `.Draftail-block--unstyled.Draftail-block--empty[data-offset-key="${blockKey}-0-0"]::before { content: "${placeholder}"; }`;
  }

  const blockPlaceholders = blockTypes
    .map((blockType) => {
      // Skips paragraph blocks as they are too common and don't need a placeholder,
      // and list items blocks as the placeholder clashes with list markers.
      if (
        blockType.type === BLOCK_TYPE.UNSTYLED ||
        blockType.type.endsWith("-list-item")
      ) {
        return "";
      }

      const description = getControlDescription(blockType);
      return description
        ? `.Draftail-block--${blockType.type}.Draftail-block--empty::before { content: "${description}"; }`
        : "";
    })
    .join("");

  return <style>{`${blockPlaceholders}${placeholderStyle}`}</style>;
}

const PlaceholderStyles = React.memo(Styles);

export default PlaceholderStyles;
