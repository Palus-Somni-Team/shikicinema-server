import { AlreadyExistsException } from '~backend/utils/exceptions/user/already-exists.exception';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserAssertionValidator } from '~backend/utils/checks/user/user-assertion-validator';

describe('UserAssertionValidator', () => {
    it('Throws on addArgumentNullError', () => {
        // arrange
        const paramName = 'val';
        const message = 'message';

        let wasThrown = false;
        try {
            // act
            UserAssertionValidator.instance.addArgumentNullError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof NotFoundException).toBe(true);
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
            UserAssertionValidator.instance.addRangeError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof BadRequestException).toBe(true);
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
            UserAssertionValidator.instance.addArgumentNotNullError(paramName, message);
        } catch (e) {
            // assert
            wasThrown = true;
            expect(e instanceof AlreadyExistsException).toBe(true);
            expect(e.message).toBe(message);
        }

        expect(wasThrown).toBe(true);
    });

    it('Do nothing on throwCollected', () => {
        // arrange
        let wasThrown = false;

        // act
        try {
            UserAssertionValidator.instance.throwCollected();
        } catch (e) {
            wasThrown = true;
        }

        // assert
        expect(wasThrown).toBe(false);
    });
});
