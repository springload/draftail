import initStoryshots from "@storybook/addon-storyshots";
import { mount } from "enzyme";

initStoryshots({
  suite: "Storyshots smoke tests",
  test: ({ story }) => {
    const storyElement = story.render();
    mount(storyElement);
  },
});
