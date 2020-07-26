export class ServerError extends Error {

    readonly brief: string;
    readonly status: number;

    /**
     *
     * @param brief short error message
     * @param code status code of http response
     * @param message extra information about error
     */
    constructor(brief: string, code: number, message?: string) {
        message = message ? message : '';

        super(message);
        this.brief = brief;
        this.status = code;
        this.message = message;
    }

    toString() {
        return `Error ${this?.status ? 'with status ' + this?.status : ''}: ${this?.message}`;
    }
}
