import { ArgumentNotNullException } from '~backend/utils/exceptions/dev/argument-not-null.exception';
import { ArgumentNullException } from '~backend/utils/exceptions/dev/argument-null.exception';
import { ArgumentOutOfRangeException } from '~backend/utils/exceptions/dev/argument-out-of-range.exception';
import { DevAssertionValidator } from '~backend/utils/checks/dev/dev-assertion-validator';

describe('DevAssertionValidator', () => {
    it('Throws on addArgumentNullError', () => {
        // arrange
        const paramName = 'val';
        const message = 'message';

        let wasThrown = false;
        try {
            // act
            DevAssertionValidator.instance.addArgumentNullError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof ArgumentNullException).toBe(true);
            expect(e.name).toBe(paramName);
            expect(e.message).toBe(message);
        }

        expect(wasThrown).toBe(true);
    });

    it('Throws on addRangeError', () => {
        // arrange
        const paramName = 'val';
        const message = 'message';

        let wasThrown = false;
        try {
            // act
            DevAssertionValidator.instance.addRangeError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof ArgumentOutOfRangeException).toBe(true);
            expect(e.name).toBe(paramName);
            expect(e.message).toBe(message);
        }

        expect(wasThrown).toBe(true);
    });

    it('Throws on addArgumentNotNullError', () => {
        // arrange
        const paramName = 'val';
        const message = 'message';

        let wasThrown = false;
        try {
            // act
            DevAssertionValidator.instance.addArgumentNotNullError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof ArgumentNotNullException).toBe(true);
            expect(e.name).toBe(paramName);
            expect(e.message).toBe(message);
        }

        expect(wasThrown).toBe(true);
    });

    it('Do nothing on throwCollected', () => {
        // arrange
        let wasThrown = false;

        // act
        try {
            DevAssertionValidator.instance.throwCollected();
        } catch (e) {
            wasThrown = true;
        }

        // assert
        expect(wasThrown).toBe(false);
    });
});
