const timeout = 5000;

describe(
    '/ (Home Page)',
    () => {
        let page;
        beforeAll(async () => {
            page = await global.__BROWSER__.newPage();
            await page.goto('http://localhost:5000/draftail/');
        }, timeout);

        it('should load without error', async () => {
            let text = await page.evaluate(() => document.body.textContent);
            expect(text).toContain('draftail');
        });
    },
    timeout,
);
