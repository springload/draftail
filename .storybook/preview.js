import "../examples/main.scss";
import "../examples/utils/polyfills";

const iconWrapper = document.createElement("div");
iconWrapper.innerHTML = SVG_ICONS;
document.body.appendChild(iconWrapper);

document.querySelector("html").setAttribute("lang", "en");

if (SENTRY_DSN) {
  const Sentry = require("@sentry/browser");
  Sentry.init({
    dsn: SENTRY_DSN,
    release: PKG_VERSION,
  });
}

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
