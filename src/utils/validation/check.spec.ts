import { ArgumentOutOfRangeException } from '@app-utils/exceptions/argument-out-of-range.exception';
import { Assert } from '@app-utils/validation/assert';

describe('Check<T>', () => {
    describe('Number checks', () => {
        const cases = [
            { less: 1, middle: 2, greater: 3 },
            { less: 0.000001, middle: 0.000002, greater: 0.000003 },
        ];

        for (const { less, middle, greater } of cases) {
            it(`greaterOrEqualTo: throws on (${{ less, greater }})`, () => {
                const paramName = 'greater';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, less).greaterOrEqualTo(greater);
                } catch (e) {
                    wasThrown = true;
                    expect(e instanceof ArgumentOutOfRangeException).toBe(true);
                    expect(e.name).toBe(paramName);
                    expect(e.message).toBe(`Expected ${paramName} to be greater or equal to ${greater}.`);
                }

                expect(wasThrown).toBe(true);
            });

            it(`greaterOrEqualTo: doesn't throw on ${{ greater, less }}`, () => {
                const paramName = 'less';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, greater).greaterOrEqualTo(less);
                } catch (e) {
                    wasThrown = true;
                }

                expect(wasThrown).toBe(false);
            });

            it(`greaterOrEqualTo: doesn't throw if values are equal (${middle})`, () => {
                const paramName = 'middle';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, middle).greaterOrEqualTo(middle);
                } catch (e) {
                    wasThrown = true;
                }

                expect(wasThrown).toBe(false);
            });

            it(`between: range include borders ${{ less, greater }}`, () => {
                const paramName = 'middle';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, less).between(less, greater);
                    Assert.Argument(paramName, greater).between(less, greater);
                } catch (e) {
                    wasThrown = true;
                }

                expect(wasThrown).toBe(false);
            });

            it(`between: throws if greater than max value ${{ less, middle, greater }}`, () => {
                const paramName = 'greater';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, greater).between(less, middle);
                } catch (e) {
                    wasThrown = true;
                    expect(e instanceof ArgumentOutOfRangeException).toBe(true);
                    expect(e.name).toBe(paramName);
                    expect(e.message).toBe(`Expected ${paramName} to be between ${less} and ${middle}.`);
                }

                expect(wasThrown).toBe(true);
            });

            it(`between: throws if less than min value ${{ less, middle, greater }}`, () => {
                const paramName = 'less';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, less).between(middle, greater);
                } catch (e) {
                    wasThrown = true;
                    expect(e instanceof ArgumentOutOfRangeException).toBe(true);
                    expect(e.name).toBe(paramName);
                    expect(e.message).toBe(`Expected ${paramName} to be between ${middle} and ${greater}.`);
                }

                expect(wasThrown).toBe(true);
            });
        }
    });

    describe('ArrayLike', () => {
        const cases = [
            'string',
            [1, 2, 3, 4],
        ];

        for (const val of cases) {
            it(`lengthBetween: throws if less than min value ${{ val }}`, () => {
                const paramName = 'val';
                const min = val.length + 1;
                const max = val.length + 2;
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, val).lengthBetween(min, max);
                } catch (e) {
                    wasThrown = true;
                    expect(e instanceof ArgumentOutOfRangeException).toBe(true);
                    expect(e.name).toBe(paramName);
                    expect(e.message).toBe(`Expected ${paramName} length to be between ${min} and ${max}.`);
                }

                expect(wasThrown).toBe(true);
            });

            it(`lengthBetween: throws if greater than max value ${{ val }}`, () => {
                const paramName = 'val';
                const min = val.length - 2;
                const max = val.length - 1;
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, val).lengthBetween(min, max);
                } catch (e) {
                    wasThrown = true;
                    expect(e instanceof ArgumentOutOfRangeException).toBe(true);
                    expect(e.name).toBe(paramName);
                    expect(e.message).toBe(`Expected ${paramName} length to be between ${min} and ${max}.`);
                }

                expect(wasThrown).toBe(true);
            });

            it(`between: range include borders ${{ val }}`, () => {
                const paramName = 'middle';
                let wasThrown = false;
                try {
                    Assert.Argument(paramName, val).lengthBetween(val.length, val.length + 1);
                    Assert.Argument(paramName, val).lengthBetween(val.length - 1, val.length);
                } catch (e) {
                    wasThrown = true;
                }

                expect(wasThrown).toBe(false);
            });
        }
    });
});
