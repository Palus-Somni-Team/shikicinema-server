import { TestValidator } from '~backend/utils/checks/test/test-validator';
import { assertValidatorErrors } from '~backend/utils/checks/test/check-test.utils';

describe('isNull', () => {
    const validator = new TestValidator();

    beforeEach(() => {
        validator.clear();
    });

    it('doesn\'t throw if null or undefined', () => {
        // arrange
        const paramName = 'key';

        // act
        validator.checkValue(paramName, null).isNullish();
        validator.checkValue(paramName, undefined).isNullish();

        // assert
        expect(validator.argumentNotNullErrors.size).toBe(0);
    });

    it('throws if argument not null or undefined', () => {
        // arrange
        const paramName = 'key';

        // act
        validator.checkValue(paramName, {}).isNullish();

        // assert
        assertValidatorErrors(validator.argumentNotNullErrors, paramName, `Expected ${paramName} to be nullish.`);
    });

    it('notExists method changes message', () => {
        // arrange
        const paramName = 'key';

        // act
        validator.checkValue(paramName, {}).notExists();

        // assert
        assertValidatorErrors(validator.argumentNotNullErrors, paramName, `${paramName} is already exists.`);
    });

    it('uses custom message if passed', () => {
        // arrange
        const paramName = 'key';
        const message = 'custom message';

        // act
        validator.checkValue(paramName, {}).notExists(message);

        // assert
        assertValidatorErrors(validator.argumentNotNullErrors, paramName, message);
    });
});
