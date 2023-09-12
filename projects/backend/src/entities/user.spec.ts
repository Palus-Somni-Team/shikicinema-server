import * as bcrypt from 'bcrypt';

import { UserEntity } from '~backend/entities';

describe('UserEntity', () => {
    it('should test entity constructor', () => {
        const [login, password, email] = ['userCT', 'password', 'userCT@email.com'];
        const entity = new UserEntity(login, password, email, null);

        expect(entity.login).toBe(login);
        expect(entity.name).toBe(login);
        expect(entity.password).toBe(password);
        expect(entity.email).toBe(email);
        expect(entity.uploader).toBe(null);
    });

    it('should test password hash function', async () => {
        const entity = new UserEntity('userPHT', 'password', 'userPHT@email.com', null);
        const passwordBeforeHashing = entity.password;
        await entity.hashPassword();
        const passwordAfterHashing = entity.password;
        const comparisonResult = await bcrypt.compare(passwordBeforeHashing, passwordAfterHashing);

        expect(comparisonResult).toBe(true);
    });
});
