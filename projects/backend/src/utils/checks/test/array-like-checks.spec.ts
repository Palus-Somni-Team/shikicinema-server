import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('ArrayLike', () => {
    const cases = [
        'string',
        [1, 2, 3, 4],
    ];

    const validator = new TestValidator();

    beforeEach(() => {
        validator.clear();
    });

    for (const val of cases) {
        it(`minLength: throws if less than min value ${{ val }}`, () => {
            // arrange
            const paramName = 'val';
            const min = val.length + 1;

            // act
            validator.checkValue(paramName, val).minLength(min);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} length to be greater or equal to ${min}.`);
        });

        it(`minLength: doesn't throw on equal length ${{ val }}`, () => {
            // arrange
            const paramName = 'middle';

            // act
            validator.checkValue(paramName, val).minLength(val.length);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`maxLength: throws if greater than max value ${{ val }}`, () => {
            // arrange
            const paramName = 'val';
            const max = val.length - 1;

            // act
            validator.checkValue(paramName, val).maxLength(max);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} length to be less or equal to ${max}.`);
        });

        it(`maxLength: doesn't throw on equal length ${{ val }}`, () => {
            // arrange
            const paramName = 'middle';

            // act
            validator.checkValue(paramName, val).maxLength(val.length);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });
    }
});
