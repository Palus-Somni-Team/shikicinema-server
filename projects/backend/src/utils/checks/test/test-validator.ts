import { ValidatorBase } from '~backend/utils/checks/validator-base';

/**
 * Validator for check tests.
 */
export class TestValidator extends ValidatorBase {
    public readonly rangeErrors: Map<string, string[]> = new Map<string, string[]>();
    public readonly argumentNullErrors: Map<string, string[]> = new Map<string, string[]>();
    public readonly argumentNotNullErrors: Map<string, string[]> = new Map<string, string[]>();

    addRangeError(key: string, message?: string): void {
        if (this.rangeErrors.has(key)) {
            this.rangeErrors.get(key).push(message);
        } else {
            this.rangeErrors.set(key, [message]);
        }
    }

    addArgumentNullError(key: string, message?: string): void {
        if (this.argumentNullErrors.has(key)) {
            this.argumentNullErrors.get(key).push(message);
        } else {
            this.argumentNullErrors.set(key, [message]);
        }
    }

    addArgumentNotNullError(key: string, message?: string): void {
        if (this.argumentNotNullErrors.has(key)) {
            this.argumentNotNullErrors.get(key).push(message);
        } else {
            this.argumentNotNullErrors.set(key, [message]);
        }
    }

    throwCollected(): void {
        return;
    }
}
