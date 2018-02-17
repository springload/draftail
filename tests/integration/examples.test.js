import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('/examples/', () => {
    let page;
    beforeAll(async () => {
        page = await global.BROWSER.newPage();
        await page.goto(`${global.ROOT}examples/`);

        await page.addScriptTag({ path: require.resolve('axe-core') });
    });

    it('loads', async () => {
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain('Write here…');
    });

    it('axe', async () => {
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
