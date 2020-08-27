import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {Response} from 'superagent';
import {app as server} from '../src/server';
import {UserEntity} from '../src/models/UserEntity';
import {CreateUserRequest, UpdateUserRequest} from '../lib/shikicinema';
import UserRepo from '../src/services/UserRepo';
import {User} from '../src/types/User';

chai.use(chaiHttp);
describe('Users API', () => {
    beforeEach(async () => await UserEntity.destroy({truncate: true}));

    const validUser: CreateUserRequest = {
        login: 'user1',
        password: 'password',
        email: 'user1@gmail.com',
    };
    const invalidData: {message: string; user: Partial<CreateUserRequest>}[] = [
        {
            message: 'only with login',
            user: {
                login: 'login1',
            },
        },
        {
            message: 'only with password',
            user: {
                password: '12345678',
            },
        },
        {
            message: 'only with password',
            user: {
                email: 'user3@gmail.com',
            },
        },
        {
            message: 'without email',
            user: {
                login: 'login4',
                password: '12345678',
            },
        },
        {
            message: 'without login',
            user: {
                password: '12345678',
                email: 'user5@gmail.com',
            },
        },
        {
            message: 'without password',
            user: {
                login: 'login6',
                email: 'user6@gmail.com',
            },
        },
    ];

    describe('/POST user', () => {
        for (const data of invalidData) {
            it(`should not create user: data ${data.message}`, (done) => {
                chai.request(server)
                    .post('/api/users')
                    .send(data.user)
                    .end((err, res) => {
                        assert.strictEqual(res.status, 422);
                        assert.strictEqual(typeof res.body, 'object');
                    });
                done();
            });
        }

        it('should create user', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(validUser)
                .end((err, res) => {
                    assert.strictEqual(res.status, 201);
                    assert.strictEqual(typeof res.body, 'object');
                    assert.strictEqual(res.body.login, validUser.login);
                    return done();
                });
        });
    });

    describe('/GET users', () => {
        it('should GET users', (done) => {
            chai.request(server)
                .get('/api/users')
                .send()
                .end((err, res) => {
                    assert.strictEqual(res.status, 200);
                    assert.ok(res.body instanceof Array);
                    return done();
                });
        });

        it('should GET users by query', (done) => {
            UserRepo.create(validUser)
                .then(async (user) => {
                    const userDto = User.toDTO(user);
                    const res = await chai.request(server)
                        .get('/api/users')
                        .query({
                            'id': userDto.id,
                            'login': userDto.login,
                            'name': userDto.name,
                            'email': userDto.email,
                            'roles[]': userDto.roles,
                            'createdAt': userDto.createdAt,
                        })
                        .send();
                    return Promise.resolve<[UserEntity, Response]>([user, res]);
                })
                .then(([user, res]) => {
                    const found: User = res.body[0];
                    assert.strictEqual(res.status, 200);
                    assert.deepStrictEqual(found, User.toDTO(user));
                    return done();
                });
        });
    });

    describe('/GET/:id user', () => {
        it('should GET user by id', async () => {
            return UserRepo.create(validUser)
                .then(async (user) => {
                    const res = await chai.request(server)
                        .get(`/api/users/${user?.id}`)
                        .send();
                    return Promise.resolve<[UserEntity, Response]>([user, res]);
                })
                .then(([user, res]) => {
                    assert.strictEqual(res.status, 200);
                    assert.deepStrictEqual(res.body, User.toDTO(user));
                });
        });
    });

    describe('/PUT/:id user', () => {
        it('should not UPDATE a protected fields of user without Authorization', (done) => {
            const changes: UpdateUserRequest = {
                roles: ['admin'],
            };
            UserRepo.create(validUser)
                .then((user) => chai.request(server).put(`/api/users/${user?.id}`).send(changes))
                .then((res) => {
                    assert.strictEqual(res.status, 403);
                    return done();
                });
        });

        it('should not UPDATE a user without Authorization', async () => {
            const changes: UpdateUserRequest = {
                name: 'user1_nickname',
                password: 'new_password12345678',
                email: 'user1_new@gmail.com',
                shikimoriId: 1234567890,
            };
            return UserRepo.create(validUser)
                .then((user) => chai.request(server).put(`/api/users/${user?.id}`).send(changes))
                .then(async (res) => {
                    assert.strictEqual(res.status, 403);
                });
        });
    });

    describe('/DELETE/:id user', () => {
        it('should not DELETE user by id without Authorization', async () => {
            return UserRepo.create(validUser)
                .then((user) => chai.request(server).delete(`/api/users/${user?.id}`).send())
                .then((res) => {
                    assert.strictEqual(res.status, 403);
                });
        });
    });
});
