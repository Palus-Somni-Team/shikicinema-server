export function queryString(obj: any): string {
    const params = Object.keys(obj).map((key) => `${key}=${obj[key]}`).join('&');
    return params.length === 0 ? params : `?${params}`;
}
