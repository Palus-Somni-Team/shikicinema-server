import { InitialOptionsTsJest } from 'ts-jest/dist/types';

import commonJestConfig from './jest-common-config';

export default {
    ...commonJestConfig,
    testRegex: '.e2e-spec.ts$', // run only e2e tests
} as InitialOptionsTsJest;
