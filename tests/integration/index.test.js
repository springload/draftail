const timeout = 5000;

describe(
    '/ (Home Page)',
    () => {
        let page;
        beforeAll(async () => {
            page = await global.BROWSER.newPage();
            await page.goto(global.ROOT);
        }, timeout);

        it('should load without error', async () => {
            const text = await page.evaluate(() => document.body.textContent);
            expect(text).toContain('draftail');
        });
    },
    timeout,
);
