import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('/', () => {
    let page;
    beforeAll(async () => {
        page = await global.BROWSER.newPage();
        await page.goto(global.ROOT);
    });

    it('should load without error', async () => {
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain('draftail');
    });

    it.skip('axe', async () => {
        await page.addScriptTag({
            path: require.resolve('axe-core'),
        });

        const text = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                window.axe.run((err, results) => {
                    if (err) reject(err);
                    resolve(results);
                });
            });
        });
        expect(text).toHaveNoViolations();
    });
});
