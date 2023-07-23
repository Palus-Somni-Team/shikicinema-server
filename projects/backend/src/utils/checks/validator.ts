import { Check } from '~backend/utils/checks/check';

/**
 * Collects errors from outside.
 * Throws exception with collected errors.
 * Type of the exception depends on implementation.
 * Exception also can be thrown on adding.
 */
export interface Validator {
    /**
     * Adds new range error to validator.
     * @param {string} key Error key.
     * @param {string} message Error message.
     */
    addRangeError(key: string, message?: string): void;

    /**
     * Adds new null argument error to validator. (It was expected that argument NOT null).
     * @param key Error key.
     * @param message Error message.
     */
    addArgumentNullError(key: string, message?: string): void;

    /**
     * Adds new not null argument error to validator. (It was expected that argument null).
     * @param key Error key.
     * @param message Error message.
     */
    addArgumentNotNullError(key: string, message?: string): void;

    /**
     * Creates new Check with provided key/value pair and this validator.
     * @param key key for error creating
     * @param value value to validate
     */
    checkValue<T>(key: string, value: T): Check<T>
}
