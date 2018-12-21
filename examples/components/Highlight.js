// @flow
import React from "react";

const onCopy = (value) => {
  const hidden = document.createElement("textarea");
  hidden.value = value;
  // $FlowFixMe
  document.body.appendChild(hidden);
  hidden.select();
  document.execCommand("copy");
  // $FlowFixMe
  document.body.removeChild(hidden);
};

const Highlight = ({ value }: { value: string }) => (
  <pre style={{ position: "relative" }}>
    <button
      type="button"
      onClick={onCopy.bind(null, value)}
      style={{ position: "absolute", right: "1rem" }}
    >
      Copy
    </button>
    <code>{value}</code>
  </pre>
);

export default Highlight;
