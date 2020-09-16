import { Role } from '@shikicinema';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should test entity constructor', () => {
    const [login, password, email] = ['userCT', 'password', 'userCT@email.com'];
    const entity = new UserEntity(login, password, email);

    expect(entity.login).toBe(login);
    expect(entity.name).toBe(login);
    expect(entity.password).toBe(password);
    expect(entity.email).toBe(email);
    expect(entity.roles).toStrictEqual([Role.user]);
    expect(entity.uploader).toBe(null);
  });

  it('should test password hash function', async () => {
    const entity = new UserEntity('userPHT', 'password', 'userPHT@email.com');
    const passwordBeforeHashing = entity.password;
    await entity.hashPassword();
    const passwordAfterHashing = entity.password;
    const comparisonResult = await bcrypt.compare(passwordBeforeHashing, passwordAfterHashing);

    expect(comparisonResult).toBe(true);
  });
});
