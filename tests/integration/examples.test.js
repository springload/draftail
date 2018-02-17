import path from 'path';
import fs from 'fs';
import { toHaveNoViolations } from 'jest-axe';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend(toHaveNoViolations);
expect.extend({ toMatchImageSnapshot });

const normalizePath = path.join(__dirname, 'normalize-rendering.css');
const normalizeRendering = fs.readFileSync(normalizePath, 'utf-8');

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

    describe('simple editor', () => {
        it('renders', async () => {
            await page.addStyleTag({ content: normalizeRendering });

            await page.type('[data-mount] [role="textbox"]', 'Hello');
            await page.keyboard.press('Enter');
            await page.type('[data-mount] [role="textbox"]', '- ');
            await page.type('[data-mount] [role="textbox"]', 'World');

            const clip = await page.evaluate(() =>
                document
                    .querySelector('[data-mount]')
                    .getBoundingClientRect()
                    .toJSON(),
            );

            expect(await page.screenshot({ clip })).toMatchImageSnapshot({
                failureThresholdType: 'percent',
                // 0.2% difference to account for font rendering.
                failureThreshold: '0.002',
            });
        });
    });
});
