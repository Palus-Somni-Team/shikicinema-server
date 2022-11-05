export class ArgumentOutOfRangeException extends Error {
    public name: string;

    constructor(name: string, message?: string) {
        super(message ? message : `${name} out of range.`);
        this.name = name;
    }
}
