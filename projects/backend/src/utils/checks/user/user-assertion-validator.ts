import { AlreadyExistsException } from '~backend/utils/exceptions/user/already-exists.exception';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ValidatorBase } from '~backend/utils/checks/validator-base';

/**
 * Throws dev exceptions on adding error.
 */
export class UserAssertionValidator extends ValidatorBase {
    public static readonly instance = new UserAssertionValidator();

    addRangeError(key: string, message?: string): void {
        throw new BadRequestException(message);
    }

    addArgumentNullError(key: string, message?: string): void {
        throw new NotFoundException(message);
    }

    addArgumentNotNullError(key: string, message?: string): void {
        throw new AlreadyExistsException(message);
    }

    throwCollected(): void {
        return;
    }
}
