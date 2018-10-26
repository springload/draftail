import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

jest.setTimeout(10000);

describe("/", () => {
  let page;
  beforeAll(async () => {
    page = await global.BROWSER.newPage();
    await page.goto(global.ROOT);

    await page.addScriptTag({ path: require.resolve("axe-core") });
  });

  it("loads", async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain("Draftail");
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
});
