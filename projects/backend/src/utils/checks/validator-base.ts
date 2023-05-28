import { Check } from '~backend/utils/checks/check';
import { Validator } from '~backend/utils/checks/validator';

export abstract class ValidatorBase implements Validator {
    abstract addRangeError(key: string, message?: string): void;
    abstract addArgumentNullError(key: string, message?: string): void;
    abstract addArgumentNotNullError(key: string, message?: string): void;
    abstract throwCollected(): void;

    public checkValue<T>(key: string, value: T): Check<T> {
        return new Check(key, value, this);
    }
}
