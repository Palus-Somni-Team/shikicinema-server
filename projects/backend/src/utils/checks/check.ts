import { Validator } from '~backend/utils/checks/validator';

export class Check<T> {
    private readonly _name: string;
    private readonly _value: T;
    private readonly _validator;
    private _validationIsStopped = false;

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

    notNull(this: Check<T>, message?: string): Check<T> {
        message ??= `Expected ${this.name} not to be null.`;

        if (this.value === undefined || this.value === null) {
            this._validator.addArgumentNullError(this.name, message);
            this._validationIsStopped = true;
        }

        return this;
    }

    isNull(this: Check<T>, message?: string): Check<T> {
        message ??= `Expected ${this.name} to be null.`;

        if (this.value !== undefined && this.value !== null) {
            this._validator.addArgumentNotNullError(this.name, message);
        }

        this._validationIsStopped = true;

        return this;
    }

    exists(this: Check<T>, message?: string): Check<T> {
        message ??= `${this.name} is not found.`;
        return this.notNull(message);
    }

    notExists(this: Check<T>, message?: string): Check<T> {
        message ??= `${this.name} is already exists.`;
        return this.isNull(message);
    }

    //endregion object

    //#region number

    greaterOrEqualTo<T extends number>(this: Check<T>, value: number): Check<T> {
        if (this._validationIsStopped) return this;

        if (this.value < value) {
            this._validator.addRangeError(this.name, `Expected ${this.name} to be greater or equal to ${value}.`);
        }

        return this;
    }

    between<T extends number>(this: Check<T>, min: number, max: number): Check<T> {
        if (this._validationIsStopped) return this;

        if (max < this.value || this.value < min) {
            this._validator.addRangeError(this._name, `Expected ${this.name} to be between ${min} and ${max}.`);
        }

        return this;
    }

    //#endregion number

    //#region array-like

    lengthBetween<TArray, TValue extends ArrayLike<TArray>>(
        this: Check<TValue>,
        min: number,
        max: number,
    ): Check<TValue> {
        if (this._validationIsStopped) return this;

        if (max < this.value.length || this.value.length < min) {
            this._validator.addRangeError(this.name, `Expected ${this.name} length to be between ${min} and ${max}.`);
        }

        return this;
    }

    notEmpty<TArray, TValue extends ArrayLike<TArray>>(
        this: Check<TValue>,
    ): Check<TValue> {
        if (this._validationIsStopped) return this;

        if (this.value.length === 0) {
            this._validator.addRangeError(this.name, `Expected ${this.name} not to be empty.`);
        }

        return this;
    }

    //#endregion array-like
}
