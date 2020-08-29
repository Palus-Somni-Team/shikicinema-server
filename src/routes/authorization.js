const express = require('express');
const router = express.Router();

const Users = require('../models').UserEntity;
const middleware = require('../auth/middleware');

/* path /auth/ */

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: User authentication
 *      description: 'to log in the user. NOTICE that cookies must be accepted and stored.'
 *      tags:
 *          - Authorizaion
 *      produces:
 *          - application/json
 *      requestBody:
 *          description: User credentials
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserCredentials'
 *      responses:
 *          200:
 *              description: Successfully logged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserWithoutPassword'
 *          400:
 *              description: Invalid required parameters
 *          401:
 *              description: Request accepted, but these credentials are invalid
 *          500:
 *              description: Server fails on some operation, try later
 */
router.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    if (!login || !password || login.length > 16 || password.length > 32) {
        return res.status(400).send({message: 'Parameters validation failed'});
    }

    Users.findOne({where: {login: login}})
        .then(async (user) => {
            if (!!user && await middleware.validateUser(user, password)) {
                const proxy_user = JSON.parse(JSON.stringify(user));
                proxy_user.password = undefined; // remove password's hash from the response

                req.session.user = proxy_user;
                res.json(proxy_user);
            } else {
                res.status(400).send({message: 'Login or Password is incorrect'});
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send();
        });
});

/**
 * @swagger
 * /auth/logout:
 *  get:
 *      summary: Log out user
 *      description: to log out the user
 *      tags:
 *          - Authorizaion
 *      security:
 *          - BearerAuth:
 *              - token
 *          - OAuth2:
 *              - default
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully logged out
 *          401:
 *              description: Unauthorized
 */
router.get('/logout', middleware.allowFor('default'), (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        res.clearCookie('user_sid');
        res.status(200).send({message: 'logged out successfully'});
    } else {
        res.status(401).send();
    }
});

/**
 * @swagger
 * /auth/me:
 *  get:
 *      summary: Returns currently logged in user's information
 *      description: Current user information
 *      tags:
 *          - Authorizaion
 *      security:
 *          - BearerAuth:
 *              - token
 *          - OAuth2:
 *              - user
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully logged out
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserWithoutPassword'
 *          401:
 *              description: Unauthorized
 */
router.get('/me', middleware.allowFor('user'), (req, res) => {
    res.status(200).send(req.session.user);
});

module.exports = router;
