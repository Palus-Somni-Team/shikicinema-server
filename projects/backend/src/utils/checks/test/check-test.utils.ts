export function assertValidatorErrors(errors: Map<string, string[]>, paramName: string, message: string): void {
    expect(errors.size).toBe(1);
    expect(errors.has(paramName)).toBe(true);
    expect(errors.get(paramName).length).toBe(1);
    expect(errors.get(paramName)[0]).toBe(message);
}
