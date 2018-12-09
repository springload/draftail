import { configure, addDecorator } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import { addLocaleData } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";
import fiLocaleData from "react-intl/locale-data/fi";
import frLocaleData from "react-intl/locale-data/fr";

import messages from "./messages";

addLocaleData(enLocaleData);
addLocaleData(fiLocaleData);
addLocaleData(frLocaleData);

setIntlConfig({
  locales: ["en", "fi", "fr"],
  defaultLocale: "fr",
  getMessages: (locale) => messages[locale],
});

addDecorator(withIntl);

configure(() => {
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

  require("../examples/main.scss");

  require("../examples/utils/polyfills");

  require("../examples/home.story");
  require("../examples/simple.story");
  require("../examples/examples.story");
  require("../examples/docs.story");
  require("../examples/performance.story");
}, module);
