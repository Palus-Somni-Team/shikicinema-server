export class ArgumentNotNullException extends Error {
    public name: string;

    constructor(name: string, message?: string) {
        super(message ? message : `Expected ${name} to be null.`);
        this.name = name;
    }
}
