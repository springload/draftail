import "../examples/main.scss";

const iconWrapper = document.createElement("div");
iconWrapper.innerHTML = SVG_ICONS;
document.body.appendChild(iconWrapper);

document.querySelector("html").setAttribute("lang", "en");

const consoleWarn = console.warn;

console.warn = function filterWarnings(msg, ...args) {
  // Stop logging React warnings we shouldn’t be doing anything about at this time.
  const supressedWarnings = [
    "Warning: componentWillMount",
    "Warning: componentWillReceiveProps",
    "Warning: componentWillUpdate",
  ];

  if (!supressedWarnings.some((entry) => msg.includes(entry))) {
    consoleWarn.apply(console, ...args);
  }
};
