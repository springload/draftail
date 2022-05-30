/* eslint-disable no-console */
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "@testing-library/jest-dom";

Enzyme.configure({ adapter: new Adapter() });

global.EMBEDLY_API_KEY = "";

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
