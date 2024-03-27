import { Validator } from '~backend/utils/checks/validator';

export class Check<T> {
    private readonly _name: string;
    private readonly _value: T;
    private readonly _validator;

    get value(): T {
        return this._value;
    }

    get name(): string {
        return this._name;
    }

    constructor(name: string, value: T, validator: Validator) {
        this._name = name;
        this._value = value;
        this._validator = validator;
    }

    //#region object

    notNullish(this: Check<T>, message?: string): Check<T> {
        message ??= `Expected ${this.name} not to be nullish.`;

        if (this.value === undefined || this.value === null) {
            this._validator.addArgumentNullError(this.name, message);
        }

        return this;
    }

    isNullish(this: Check<T>, message?: string): Check<T> {
        message ??= `Expected ${this.name} to be nullish.`;

        if (this.value !== undefined && this.value !== null) {
            this._validator.addArgumentNotNullError(this.name, message);
        }

        return this;
    }

    exists(this: Check<T>, message?: string): Check<T> {
        message ??= `${this.name} is not found.`;
        return this.notNullish(message);
    }

    notExists(this: Check<T>, message?: string): Check<T> {
        message ??= `${this.name} is already exists.`;
        return this.isNullish(message);
    }

    //endregion object

    //#region number

    greaterOrEqualTo<T extends number>(this: Check<T>, value: number): Check<T> {
        if (this.value < value) {
            this._validator.addRangeError(this.name, `Expected ${this.name} to be greater or equal to ${value}.`);
        }

        return this;
    }

    lessOrEqualTo<T extends number>(this: Check<T>, value: number): Check<T> {
        if (this.value > value) {
            this._validator.addRangeError(this.name, `Expected ${this.name} to be less or equal to ${value}.`);
        }

        return this;
    }

    between<T extends number>(this: Check<T>, min: number, max: number): Check<T> {
        if (max < this.value || this.value < min) {
            this._validator.addRangeError(this._name, `Expected ${this.name} to be between ${min} and ${max}.`);
        }

        return this;
    }

    equals<T extends number>(this: Check<T>, expected: number, message: string = null): Check<T> {
        if (this.value !== expected) {
            const msg = message ? message : `Expected ${this.name} to be ${expected}, but found ${this.value}.`;
            this._validator.addRangeError(this._name, msg);
        }

        return this;
    }

    //#endregion number

    //#region array-like

    maxLength<TArray, TValue extends ArrayLike<TArray>>(
        this: Check<TValue>,
        max: number
    ): Check<TValue> {
        if (max < this.value.length) {
            this._validator.addRangeError(this.name, `Expected ${this.name} length to be less or equal to ${max}.`);
        }

        return this;
    }

    minLength<TArray, TValue extends ArrayLike<TArray>>(
        this: Check<TValue>,
        min: number
    ): Check<TValue> {
        if (min > this.value.length) {
            this._validator.addRangeError(this.name, `Expected ${this.name} length to be greater or equal to ${min}.`);
        }

        return this;
    }

    notEmpty<TArray, TValue extends ArrayLike<TArray>>(
        this: Check<TValue>,
    ): Check<TValue> {
        if (this.value.length === 0) {
            this._validator.addRangeError(this.name, `Expected ${this.name} not to be empty.`);
        }

        return this;
    }

    //#endregion array-like
}
