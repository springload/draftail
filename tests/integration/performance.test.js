const PERFORMANCE_BUFFER = 3;

describe("performance", () => {
  let page;
  beforeEach(async () => {
    page = await global.BROWSER.newPage();
  });

  it("simple editor", async () => {
    await page.goto(
      `${global.ROOT}?selectedKind=Draftail&selectedStory=Simple`,
    );

    await page.type('[role="textbox"]', "Hello");
    await page.keyboard.press("Enter");
    await page.type('[role="textbox"]', "- ");
    await page.type('[role="textbox"]', "World");
    await page.keyboard.press("Enter");

    const heapSize = await page.evaluate(
      () => window.performance.memory.usedJSHeapSize,
    );
    const heapSizeMB = heapSize / 10 ** 6;
    expect(heapSizeMB).toBeLessThanOrEqual(25 * PERFORMANCE_BUFFER);
  });

  it("markov_draftjs 41 memory", async () => {
    await page.goto(
      `${
        global.ROOT
      }?selectedKind=Performance&selectedStory=markov_draftjs%2041`,
    );

    const heapSize = await page.evaluate(
      () => window.performance.memory.usedJSHeapSize,
    );
    const heapSizeMB = heapSize / 10 ** 6;
    expect(heapSizeMB).toBeLessThanOrEqual(19 * PERFORMANCE_BUFFER);
  });

  it("markov_draftjs 41 speed", async () => {
    await page.goto(
      `${
        global.ROOT
      }?selectedKind=Performance&selectedStory=markov_draftjs%2041`,
    );

    const mean = await page.$eval('[data-benchmark="mean"]', (elt) =>
      parseFloat(elt.innerHTML),
    );
    expect(mean).toBeLessThanOrEqual(47 * PERFORMANCE_BUFFER);
  });
});
