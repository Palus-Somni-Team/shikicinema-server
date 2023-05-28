import { ArgumentNotNullException } from '~backend/utils/exceptions/dev/argument-not-null.exception';
import { ArgumentNullException } from '~backend/utils/exceptions/dev/argument-null.exception';
import { ArgumentOutOfRangeException } from '~backend/utils/exceptions/dev/argument-out-of-range.exception';
import { ValidatorBase } from '~backend/utils/checks/validator-base';

/**
 * Throws dev exceptions on adding error.
 */
export class DevAssertionValidator extends ValidatorBase {
    public static readonly instance = new DevAssertionValidator();

    addRangeError(key: string, message?: string): void {
        throw new ArgumentOutOfRangeException(key, message);
    }

    addArgumentNullError(key: string, message?: string): void {
        throw new ArgumentNullException(key, message);
    }

    addArgumentNotNullError(key: string, message?: string): void {
        throw new ArgumentNotNullException(key, message);
    }

    throwCollected(): void {
        return;
    }
}
