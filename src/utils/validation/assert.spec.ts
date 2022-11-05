import { ArgumentNullException } from '@app-utils/exceptions/argument-null.exception';
import { Assert } from '@app-utils/validation/assert';

describe('Assert.Argument<T>', () => {
    const empties = [null, undefined];

    for (const val of empties) {
        it(`Throw if argument ${val}`, () => {
            const paramName = 'val';
            let wasThrown = false;
            try {
                Assert.Argument(paramName, val);
            } catch (e) {
                wasThrown = true;
                expect(e instanceof ArgumentNullException).toBe(true);
                expect(e.name).toBe(paramName);
                expect(e.message).toBe(`Expected ${paramName} not to be null.`);
            }

            expect(wasThrown).toBe(true);
        });
    }

    it('Doesn\'t throw if argument not null or undefined', () => {
        const param = 0;
        let wasThrown = false;
        try {
            const check = Assert.Argument('param', param);
            expect(check.name).toBe('param');
            expect(check.value).toBe(param);
        } catch (e) {
            wasThrown = true;
        }

        expect(wasThrown).toBe(false);
    });
});
