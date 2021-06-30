export function getIntArrayType() {
    return process.env.NODE_ENV === 'testing' ? 'simple-array' : 'integer';
}
