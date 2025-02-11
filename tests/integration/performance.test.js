const PERFORMANCE_BUFFER = 3;

describe("performance", () => {
  let page;
  beforeEach(async () => {
    page = await global.BROWSER.newPage();
  });

  it("simple editor", async () => {
    await page.goto(`${global.ROOT}?id=draftail--simple`);

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
    jest.setTimeout(20000);
    await page.goto(`${global.ROOT}?id=performance--markov_draftjs%2041`);

    const heapSize = await page.evaluate(
      () => window.performance.memory.usedJSHeapSize,
    );
    const heapSizeMB = heapSize / 10 ** 6;
    expect(heapSizeMB).toBeLessThanOrEqual(19 * PERFORMANCE_BUFFER);
  });

  it("markov_draftjs 41 speed", async () => {
    jest.setTimeout(20000);
    await page.goto(`${global.ROOT}?id=performance--markov-draftjs-41`);
    await page.waitForSelector('[data-benchmark="mean"]');

    const mean = await page.$eval('[data-benchmark="mean"]', (elt) =>
      parseFloat(elt.innerHTML),
    );
    expect(mean).toBeLessThanOrEqual(47 * PERFORMANCE_BUFFER);
  });
});
