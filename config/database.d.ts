export type DatabaseConfig = {
    readonly url: string;
}

export type DatabaseConfigs = {
    readonly [name: string]: DatabaseConfig;
}
