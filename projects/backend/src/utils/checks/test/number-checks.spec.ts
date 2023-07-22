import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('Number checks', () => {
    const cases = [
        { less: 1, middle: 2, greater: 3 },
        { less: 0.000001, middle: 0.000002, greater: 0.000003 },
    ];

    const validator = new TestValidator();

    beforeEach(() => {
        validator.clear();
    });

    for (const { less, middle, greater } of cases) {
        it(`greaterOrEqualTo: throws on (${{ less, greater }})`, () => {
            // arrange
            const paramName = 'less';

            // act
            validator.checkValue(paramName, less).greaterOrEqualTo(greater);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} to be greater or equal to ${greater}.`);
        });

        it(`greaterOrEqualTo: doesn't throw on ${{ greater, less }}`, () => {
            // arrange
            const paramName = 'greater';

            // act
            validator.checkValue(paramName, greater).greaterOrEqualTo(less);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`greaterOrEqualTo: doesn't throw if values are equal (${middle})`, () => {
            // arrange
            const paramName = 'middle';

            // act
            validator.checkValue(paramName, middle).greaterOrEqualTo(middle);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`lessOrEqualTo: throws on (${{ less, greater }})`, () => {
            // arrange
            const paramName = 'greater';

            // act
            validator.checkValue(paramName, greater).lessOrEqualTo(less);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} to be less or equal to ${less}.`);
        });

        it(`lessOrEqualTo: doesn't throw on ${{ greater, less }}`, () => {
            // arrange
            const paramName = 'less';

            // act
            validator.checkValue(paramName, less).lessOrEqualTo(greater);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`lessOrEqualTo: doesn't throw if values are equal (${middle})`, () => {
            // arrange
            const paramName = 'middle';

            // act
            validator.checkValue(paramName, middle).lessOrEqualTo(middle);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });
    }
});
