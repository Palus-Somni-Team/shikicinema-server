import { ArgumentOutOfRangeException } from '~backend/utils/exceptions/argument-out-of-range.exception';

export class Check<T> {
    private _name: string;
    private _value: T;

    get value(): T {
        return this._value;
    }

    get name(): string {
        return this._name;
    }

    constructor(name: string, value: T) {
        this._name = name;
        this._value = value;
    }

    //#region number

    greaterOrEqualTo<T extends number>(this: Check<T>, value: number): Check<T> {
        if (this.value < value) {
            throw new ArgumentOutOfRangeException(
                this.name,
                `Expected ${this.name} to be greater or equal to ${value}.`,
            );
        }

        return this;
    }

    between<T extends number>(this: Check<T>, min: number, max: number): Check<T> {
        if (max < this.value || this.value < min) {
            throw new ArgumentOutOfRangeException(
                this.name,
                `Expected ${this.name} to be between ${min} and ${max}.`,
            );
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
        if (max < this.value.length || this.value.length < min) {
            throw new ArgumentOutOfRangeException(
                this.name,
                `Expected ${this.name} length to be between ${min} and ${max}.`,
            );
        }

        return this;
    }

    //#endregion array-like
}
