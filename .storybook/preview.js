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
