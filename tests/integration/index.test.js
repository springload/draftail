import { toHaveNoViolations } from 'jest-axe';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend(toHaveNoViolations);
expect.extend({ toMatchImageSnapshot });

describe('/', () => {
    let page;
    beforeAll(async () => {
        page = await global.BROWSER.newPage();
        await page.goto(global.ROOT);

        await page.addScriptTag({
            path: require.resolve('axe-core'),
        });
    });

    it('loads', async () => {
        const text = await page.evaluate(() => document.body.textContent);
        expect(text).toContain('draftail');
    });

    it('a11y', async () => {
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
