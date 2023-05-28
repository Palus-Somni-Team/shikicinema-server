import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('isNull', () => {
    it('doesn\'t throw if null or undefined', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, null).isNull();
        validator.checkValue(paramName, undefined).isNull();

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(0);
    });

    it('skip following checks', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, null).isNull().lengthBetween(1, 2);

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(0);
    });

    it('throws if argument not null or undefined', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, {}).isNull();

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(1);
        expect(validator.argumentNotNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNotNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNotNullErrors.get(paramName)[0])
            .toBe(`Expected ${paramName} to be null.`);
    });

    it('notExists method changes message', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, {}).notExists();

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(1);
        expect(validator.argumentNotNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNotNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNotNullErrors.get(paramName)[0])
            .toBe(`${paramName} is already exists.`);
    });

    it('uses custom message if passed', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();
        const message = 'custom message';

        // act
        validator.checkValue(paramName, {}).notExists(message);

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(1);
        expect(validator.argumentNotNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNotNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNotNullErrors.get(paramName)[0])
            .toBe(message);
    });
});
