import React from "react";

const onCopy = (value: string) => {
  const hidden = document.createElement("textarea");
  hidden.value = value;
  document.body.appendChild(hidden);
  hidden.select();
  document.execCommand("copy");
  document.body.removeChild(hidden);
};

type Props = {
  value: string;
};

const Highlight = ({ value }: Props) => (
  <pre style={{ position: "relative" }}>
    <button
      type="button"
      onClick={onCopy.bind(null, value)}
      style={{ position: "absolute", insetInlineEnd: "1rem" }}
    >
      Copy
    </button>
    <code>{value}</code>
  </pre>
);

export default Highlight;
