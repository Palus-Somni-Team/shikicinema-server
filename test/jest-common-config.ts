import { pathsToModuleNameMapper } from 'ts-jest/utils';

const defaultJestConfig = require('./jest-default-config.json');
const { compilerOptions } = require('../tsconfig.json');

const pathMappings: { [alias: string]: string[] } = {};

for (const [alias, paths] of Object.entries<string[]>(compilerOptions.paths)) {
    // path mappings for tests shouldn't use parent dir
    // so deleting it
    pathMappings[alias] = paths.map((path) => path.replace('../', ''))
}

export default {
    ...defaultJestConfig,
    testRegex: 'spec.ts$',
    moduleNameMapper: pathsToModuleNameMapper(pathMappings),
};
