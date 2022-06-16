import React from "react";

interface PlaceholderProps {
  text: string;
}

export default function Placeholder({ text }: PlaceholderProps) {
  return <div className="Draftail-Placeholder" data-text={text} />;
}
