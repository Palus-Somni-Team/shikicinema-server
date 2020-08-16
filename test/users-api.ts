import assert from 'assert';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app as server} from '../src/server';
import {User} from '../src/models/User';

// TODO: add all controller routes
chai.use(chaiHttp);
describe('Users API', () => {
    beforeEach(async () => await User.destroy({truncate: true, cascade: true}));

    describe('/POST user', () => {
        // TODO: complete these test
        it('should not POST a user without login', () => {
            const user = {
                password: '123',
                email: 'user@example.com',
            };

            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    assert.ok(res.status === 422);
                    assert.ok(typeof res.body === 'object');
                });
        });
    });
});
