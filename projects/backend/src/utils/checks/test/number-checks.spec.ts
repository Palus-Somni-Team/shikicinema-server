import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('Number checks', () => {
    const cases = [
        { less: 1, middle: 2, greater: 3 },
        { less: 0.000001, middle: 0.000002, greater: 0.000003 },
    ];

    for (const { less, middle, greater } of cases) {
        it(`greaterOrEqualTo: throws on (${{ less, greater }})`, () => {
            // arrange
            const paramName = 'less';
            const validator = new TestValidator();

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
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, greater).greaterOrEqualTo(less);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`greaterOrEqualTo: doesn't throw if values are equal (${middle})`, () => {
            // arrange
            const paramName = 'middle';
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, middle).greaterOrEqualTo(middle);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`between: range include borders ${{ less, greater }}`, () => {
            // arrange
            const validator = new TestValidator();

            // act
            validator.checkValue('less', less).between(less, greater);
            validator.checkValue('greater', greater).between(less, greater);

            // assert
            expect(validator.rangeErrors.size).toBe(0);
        });

        it(`between: throws if greater than max value ${{ less, middle, greater }}`, () => {
            // arrange
            const paramName = 'greater';
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, greater).between(less, middle);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} to be between ${less} and ${middle}.`);
        });

        it(`between: throws if less than min value ${{ less, middle, greater }}`, () => {
            const paramName = 'less';
            const validator = new TestValidator();

            // act
            validator.checkValue(paramName, less).between(middle, greater);

            // assert
            expect(validator.rangeErrors.size).toBe(1);
            expect(validator.rangeErrors.has(paramName)).toBe(true);
            expect(validator.rangeErrors.get(paramName).length).toBe(1);
            expect(validator.rangeErrors.get(paramName)[0])
                .toBe(`Expected ${paramName} to be between ${middle} and ${greater}.`);
        });
    }
});
