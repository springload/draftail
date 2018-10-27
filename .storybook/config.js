import { configure } from "@storybook/react";

configure(() => {
  const iconWrapper = document.createElement("div");
  iconWrapper.innerHTML = SVG_ICONS;
  document.body.appendChild(iconWrapper);

  document.querySelector("html").setAttribute("lang", "en");

  require("../examples/main.scss");

  require("../examples/utils/polyfills");

  require("../examples/home.story");
  require("../examples/simple.story");
  require("../examples/examples.story");
}, module);
