export class ServerError extends Error {
    readonly brief: string;
    readonly status: number;

    /**
     * Represents errors which may be received from server
     *
     * @class ServerError
     * @param {string} brief Short error message
     * @param {string} code Status code of http response
     * @param {string} message Extra information about error
     */
    constructor(brief: string, code: number, message?: string) {
        message = message ? message : '';

        super(message);
        this.brief = brief;
        this.status = code;
        this.message = message;
    }

    toString(): string {
        return `Error ${this?.status ? 'with status ' + this?.status : ''}: ${this?.message}`;
    }
}
