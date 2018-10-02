// eslint-disable-next-line @thibaudcolas/cookbook/import/no-extraneous-dependencies
import { storiesOf } from "@storybook/react";

import simple from "../examples/simple.story";
import {
  initWagtail,
  initCustom,
  initAll,
  initTest,
} from "../examples/examples.story";

storiesOf("Draftail", module)
  .add("Simple", () => simple)
  .add("Wagtail", initWagtail)
  .add("Custom", initCustom)
  .add("All", initAll)
  .add("Test", initTest);
