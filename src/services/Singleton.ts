export class Singleton<T> {
    protected static _instance: any;

    public static getInstance<T>(ConstructorT: { new(): T}): T {
        return this._instance || new ConstructorT();
    };
}
