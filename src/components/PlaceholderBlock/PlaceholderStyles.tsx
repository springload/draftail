import React from "react";

interface PlaceholderStylesProps {
  blockKey: string;
  placeholder?: string | null;
}

/**
 * Adds placeholder "Write here…" text to the currently-focused block.
 * Done with CSS so this can switch blocks without re-rendering the whole editor.
 */
function Styles({ blockKey, placeholder }: PlaceholderStylesProps) {
  console.log("styling", blockKey);

  if (!blockKey || !placeholder) {
    return null;
  }

  return (
    <style>
      {`.Draftail-block--unstyled[data-offset-key="${blockKey}-0-0"] .Draftail-Placeholder::before { content: "${placeholder}"; }`}
    </style>
  );
}

const PlaceholderStyles = React.memo(Styles);

export default PlaceholderStyles;
