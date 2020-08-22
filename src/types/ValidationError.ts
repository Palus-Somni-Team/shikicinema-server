import {ValidationError as error} from 'express-validator';

export class ValidationError extends Error {
    readonly status: number;
    readonly errors: error[];

    constructor(code: number, errors: error[]) {
        super('Invalid required parameter');
        this.status = code;
        this.errors = errors;
    }

    toString(): string {
        const error = this.errors[0];

        return `Invalid value in '${error.param}': '${error.value}' - ${error.msg}`;
    }
}
