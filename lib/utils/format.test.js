import { truncateURL } from '../utils/format';

describe('format utils', () => {
    describe('#truncateURL', () => {
        it('exists', () => {
            expect(truncateURL).toBeDefined();
        });

        it('shortens URLs', () => {
            expect(truncateURL('http://blog.stackoverflow.com/2011/07/its-ok-to-ask-and-answer-your-own-questions/'))
                .toEqual('blog.stackoverflow.com/…swer-your-own-questions/');
        });
    });
});
