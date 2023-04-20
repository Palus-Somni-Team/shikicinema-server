export function isEntity<T>(value: any, entityType: new (...args: any[]) => T): value is T {
    return value === null || value === undefined || value instanceof entityType;
}
