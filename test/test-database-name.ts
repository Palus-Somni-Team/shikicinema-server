import assert from 'assert';
import {sequelize} from '../src/sequelize';

describe('Test database name', () => {
    it('should be "shikicinema-test"', () => {
        assert.ok(sequelize.config.database === 'shikicinema-test');
    });
});
