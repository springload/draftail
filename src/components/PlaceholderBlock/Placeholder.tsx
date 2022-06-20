import React from "react";

interface PlaceholderProps {
  text?: string | null;
}

/**
 * Renders placeholder as a data-text attribute. This allows styling with
 * CSS `content: attr(data-text)`, which can bypass Draft.js rendering optimisations.
 */
export default function Placeholder({ text }: PlaceholderProps) {
  return <div className="Draftail-Placeholder" data-text={text} />;
}
