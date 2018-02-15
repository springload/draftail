import { toHaveNoViolations } from 'jest-axe';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend(toHaveNoViolations);
expect.extend({ toMatchImageSnapshot });

describe('/', () => {
    let page;
    beforeAll(async () => {
        page = await global.BROWSER.newPage();
        await page.goto(global.ROOT);
    });

    it('loads', async () => {
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
