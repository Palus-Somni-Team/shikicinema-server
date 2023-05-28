import { TestValidator } from '~backend/utils/checks/test/test-validator';

describe('notNull', () => {
    it('throws if null', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, null).notNull();

        // assert
        expect(validator.argumentNullErrors.size).toBe(1);
        expect(validator.argumentNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNullErrors.get(paramName)[0])
            .toBe(`Expected ${paramName} not to be null.`);
    });

    it('throws if undefined', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, undefined).notNull();

        // assert
        expect(validator.argumentNullErrors.size).toBe(1);
        expect(validator.argumentNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNullErrors.get(paramName)[0])
            .toBe(`Expected ${paramName} not to be null.`);
    });

    it('skip following checks', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, undefined).notNull().lengthBetween(1, 2);

        // assert
        expect(validator.argumentNullErrors.size).toBe(1);
        expect(validator.argumentNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNullErrors.get(paramName)[0])
            .toBe(`Expected ${paramName} not to be null.`);
    });

    it('doesn\'t throw if argument not null or undefined', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, {}).notNull();

        // assert
        expect(validator.argumentNullErrors.size).toBe(0);
    });

    it('exists method changes message', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();

        // act
        validator.checkValue(paramName, undefined).exists();

        // assert
        expect(validator.argumentNullErrors.size).toBe(1);
        expect(validator.argumentNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNullErrors.get(paramName)[0])
            .toBe(`${paramName} is not found.`);
    });

    it('uses custom message if passed', () => {
        // arrange
        const paramName = 'key';
        const validator = new TestValidator();
        const message = 'custom message';

        // act
        validator.checkValue(paramName, undefined).exists(message);

        // assert
        expect(validator.argumentNullErrors.size).toBe(1);
        expect(validator.argumentNullErrors.has(paramName)).toBe(true);
        expect(validator.argumentNullErrors.get(paramName).length).toBe(1);
        expect(validator.argumentNullErrors.get(paramName)[0])
            .toBe(message);
    });
});
