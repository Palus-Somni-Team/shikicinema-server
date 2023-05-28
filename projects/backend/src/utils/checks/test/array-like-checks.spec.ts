import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('ArrayLike', () => {
    const cases = [
        'string',
        [1, 2, 3, 4],
    ];

    for (const val of cases) {
        it(`lengthBetween: throws if less than min value ${{ val }}`, () => {
            // arrange
            const paramName = 'val';
            const min = val.length + 1;
            const max = val.length + 2;
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, val).lengthBetween(min, max);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} length to be between ${min} and ${max}.`);
        });

        it(`lengthBetween: throws if greater than max value ${{ val }}`, () => {
            // arrange
            const paramName = 'val';
            const min = val.length - 2;
            const max = val.length - 1;
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, val).lengthBetween(min, max);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} length to be between ${min} and ${max}.`);
        });

        it(`lengthBetween: range include borders ${{ val }}`, () => {
            // arrange
            const paramName = 'middle';
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, val)
                .lengthBetween(val.length, val.length + 1)
                .lengthBetween(val.length - 1, val.length);


            expect(validator.rangeErrors.size).toBe(0);
        });
    }
});
