import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.setTimeout(10000);

describe("/examples/", () => {
  let page;
  beforeAll(async () => {
    page = await global.BROWSER.newPage();
    await page.goto(
      `${
        global.ROOT
      }examples/iframe.html?selectedKind=Examples&selectedStory=Wagtail%20features`,
    );

    await page.addScriptTag({ path: require.resolve("axe-core") });
  });

  it("loads", async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Write here…");
  });

  it("a11y", async () => {
    const result = await page.evaluate(
      () =>
        new Promise((resolve) => {
          window.axe.run((err, results) => {
            if (err) throw err;
            resolve(results);
          });
        }),
    );
    expect(result).toHaveNoViolations();
  });

  describe("Wagtail features", () => {
    /* eslint-disable no-await-in-loop */
    beforeEach(async () => {
      // Single-word removal.
      await page.type('[role="textbox"]', "");
      for (let i = 0; i < 10; i += 1) {
        await page.keyboard.press("Backspace");
      }
    });

    it("BOLD", async () => {
      await page.type('[role="textbox"]', "Bold");
      await page.keyboard.down("ShiftLeft");
      for (let i = 0; i < "Bold".length; i += 1) {
        await page.keyboard.press("ArrowLeft");
      }
      await page.click('[name="BOLD"]');
      await page.keyboard.up("ShiftLeft");
      await page.keyboard.press("ArrowRight");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content.blocks).toMatchSnapshot();
    });

    it("header-three", async () => {
      await page.type('[role="textbox"]', "### H3");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content.blocks).toMatchSnapshot();
    });

    it("unordered-list-item", async () => {
      await page.type('[role="textbox"]', "* UL");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content.blocks).toMatchSnapshot();
    });

    it("HORIZONTAL_RULE", async () => {
      await page.type('[role="textbox"]', "---");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content).toMatchSnapshot();
      await page.keyboard.press("Backspace");
    });

    it("BR", async () => {
      await page.type('[role="textbox"]', "Hel");
      await page.keyboard.down("ShiftLeft");
      await page.keyboard.press("Enter");
      await page.keyboard.up("ShiftLeft");
      await page.type('[role="textbox"]', "lo");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content).toMatchSnapshot();
    });

    it("IMAGE", async () => {
      await page.click('[name="IMAGE"]');
      await page.type(".modal input", "/static/example-lowres-image.jpg");
      await page.keyboard.press("Enter");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content).toMatchSnapshot();
    });

    it("LINK", async () => {
      await page.type('[role="textbox"]', "Link");
      await page.keyboard.down("ShiftLeft");
      for (let i = 0; i < "Link".length; i += 1) {
        await page.keyboard.press("ArrowLeft");
      }
      await page.keyboard.up("ShiftLeft");
      await page.click('[name="LINK"]');
      await page.type(".modal input", "http://www.example.com/");
      await page.keyboard.press("Enter");
      await page.waitFor(100);
      const content = await page.evaluate(() =>
        JSON.parse(window.sessionStorage.getItem("wagtail:content")),
      );
      content.blocks.forEach((b) => delete b.key);
      expect(content).toMatchSnapshot();
    });
  });
});
