import path from "path";
import fs from "fs";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

const normalizePath = path.join(__dirname, "normalize-rendering.css");
const normalizeRendering = fs.readFileSync(normalizePath, "utf-8");

describe("regression", () => {
  let page;
  beforeAll(async () => {
    page = await global.BROWSER.newPage();
    await page.goto(
      `${global.ROOT}?selectedKind=Draftail&selectedStory=Simple`,
    );

    await page.addStyleTag({ content: normalizeRendering });
  });

  describe("simple editor", () => {
    it("renders", async () => {
      await page.type('[role="textbox"]', "Hello");
      await page.keyboard.press("Enter");
      await page.type('[role="textbox"]', "- ");
      await page.type('[role="textbox"]', "World");

      const clip = await page.evaluate(() =>
        document
          .querySelector("#root")
          .getBoundingClientRect()
          .toJSON(),
      );

      expect(await page.screenshot({ clip })).toMatchImageSnapshot({
        failureThresholdType: "percent",
        // 0.2% difference to account for font rendering.
        failureThreshold: "0.002",
      });
    });
  });
});
