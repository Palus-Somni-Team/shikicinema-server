export class ArgumentNullException extends Error {
    public name: string;

    constructor(name: string, message?: string) {
        super(message ? message : `Expected ${name} not to be null.`);
        this.name = name;
    }
}
