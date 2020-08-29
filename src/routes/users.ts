import {Router} from 'express';
import * as bcrypt from 'bcrypt';

import * as middleware from '../auth/middleware';
import {ServerError} from '../types/ServerError';
import {UserEntity} from '../models/UserEntity';

export const users = Router();

/**
 * @description user's E-mail validation. NOTE that only gmail users are allowed!
 * @param {string} email User's email
 * @returns {boolean} Boolean if it's a correct email
 */
function isEmail(email: string): boolean {
    return /[^\s]+@(gmail.com)/i.test(email);
}

/* path /api/users/ */

/* CREATE */

/**
 * @swagger
 * /api/users:
 *  post:
 *      summary: Register new user
 *      description: Create new user if login is free
 *      tags:
 *          - User
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: body
 *            in: body
 *            required: true
 *            type: object
 *            properties:
 *              login:
 *                type: string
 *                example: John
 *              password:
 *                type: string
 *                example: passw0rd
 *              email:
 *                type: string
 *                example: john@gmail.com
 *      responses:
 *          201:
 *              description: Created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserWithoutPassword'
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server fails on some operation, try later
 */
users.post('/', async (req, res, next) => {
    const login: string = req.body.login;
    const password: string = req.body.password;
    const email: string = req.body.email;

    if (!login || !password || !email) {
        return next(new ServerError('Invalid required parameter', 400, 'Required parameters missing'));
    }

    if (login.length > 16 || password.length > 32 || login === '' || password === '' || !isEmail(email)) {
        return next(
            new ServerError(
                'Invalid parameters',
                400,
                'login/password is too long or too short, or email is invalid',
            ));
    }

    const existingLogin = await UserEntity.findOne({where: {login: login}});
    const existingEmail = await UserEntity.findOne({where: {email: email}});

    if (!existingLogin && !existingEmail) {
        return UserEntity
            .create({
                login: login,
                name: login,
                password: bcrypt.hashSync(password, 10),
                email: email,
                roles: ['user'],
            })
            .then((user) => {
                if (user) {
                    return res.status(201).send({
                        login: user.login,
                        name: user.name,
                        email: user.email,
                        roles: user.roles,
                    });
                } else {
                    return next(new ServerError('Internal Error', 500, 'An error occurred during operation'));
                }
            })
            .catch((err) => {
                console.error(err);

                return res.status(400).send();
            });
    } else {
        return next(new ServerError('Invalid required parameter', 400, 'User with these login or email is exist'));
    }
});

/* READ */

/**
 * @swagger
 * /api/users/:
 *  get:
 *      summary: List users
 *      description: Brief list of user with user's ID and username
 *      tags:
 *          - User
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: limit
 *            in: query
 *            required: false
 *            type: integer
 *          - name: offset
 *            in: query
 *            required: false
 *            type: integer
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 123
 *                                  name:
 *                                      type: string
 *                                      example: username
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server fails on some operation, try later
 */
users.get('/', async (req, res) => {
    const offset = Number.parseInt(`${req.query.offset}`, 10) || null;
    const limit = Number.parseInt(`${req.query.limit}`, 10) || null;
    let users;

    if (limit && offset) {
        users = await UserEntity.findAll({
            limit, offset,
            attributes: ['id', 'name'],
        });
    } else {
        users = await UserEntity.findAll({
            attributes: ['id', 'name'],
        });
    }

    if (users) {
        res.status(200).send(users);
    } else {
        res.status(500).send([]);
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *      summary: Find user
 *      description: Find user with ID
 *      tags:
 *          - User
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  example: 123
 *                              name:
 *                                  type: string
 *                                  example: username
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: No such user
 *          500:
 *              description: Server fails on some operation, try later
 */
users.get('/:id', async (req, res) => {
    const id = Number.parseInt(`${req.params.id}`, 10) || null;
    let user;

    if (id && !isNaN(id)) {
        user = await UserEntity.findOne({
            where: {id: id},
        });
    } else {
        res.status(400).send({message: `wrong value for parameter id: ${id}`});
    }

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send();
    }
});

/* UPDATE */

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *      summary: Change user
 *      description: Change user with ID
 *      tags:
 *          - User
 *      security:
 *          - BearerAuth:
 *              - token
 *          - OAuth2:
 *              - user
 *              - admin
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UserWithoutPassword'
 *          400:
 *              description: Invalid user ID
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server fails on some operation, try later
 */
users.put('/:id', middleware.allowFor('user', 'admin'), async (req, res, next) => {
    const id = Number.parseInt(`${req.params.id}`, 10) || null;

    if (id && !isNaN(id)) {
        const requester = await UserEntity.findOne({where: {id: req.session?.user.id}})
            .catch((err) => next(err));

        if (id == req.session?.user.id || (requester as UserEntity)?.isAdmin) {
            // if not admin
            if (!(requester as UserEntity)?.isAdmin) {
                req.body.id = undefined; // do not change user id
                req.body.scopes = undefined; // ...and scopes
            }

            UserEntity.update(req.body, {where: {id: id}})
                .then(() => UserEntity.findOne({where: {id: req.body.id || id}}))
                .then((user) => {
                    return res.status(200).send({
                        id: user?.id,
                        name: user?.name,
                        login: user?.login,
                        email: user?.email,
                        roles: user?.roles,
                    });
                })
                .catch((err) => next(err));
        } else {
            return next(new ServerError('Forbidden', 403, 'Trying to change protected resources you don\'t belong to'));
        }
    } else {
        return next(new ServerError('Invalid required parameter', 400, `Wrong value for parameter id: ${id}`));
    }
});

/* DELETE */

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *      summary: Delete user
 *      description: Delete user with ID
 *      tags:
 *          - User
 *      security:
 *          - BearerAuth:
 *              - token
 *          - OAuth2:
 *              - user
 *              - admin
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            type: integer
 *      responses:
 *          200:
 *              description: OK
 *          400:
 *              description: Invalid user ID
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Server fails on some operation, try later
 */
users.delete('/:id', middleware.allowFor('user', 'admin'), async (req, res, next) => {
    const id = Number.parseInt(`${req.params.id}`, 10) || null;

    if (id && !isNaN(id)) {
        const requester = await UserEntity.findOne({where: {id: req.session?.user?.id}})
            .catch((err) => next(err));

        if (id == req.session?.user?.id || (requester as UserEntity)?.isAdmin) {
            UserEntity.destroy({where: {id: id}})
                .then(() => res.status(200).send({}))
                .catch((err) => next(err));
        } else {
            return next(new ServerError('Forbidden', 403, 'Trying to change protected resources you don\'t belong to'));
        }
    } else {
        return next(new ServerError('Invalid required parameter', 400, `Wrong value for parameter id: ${id}`));
    }
});

/* OTHER */
/**
 * @swagger
 * /api/users/count:
 *  post:
 *      summary: Count all users
 *      tags:
 *          - User
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: integer
 *                                  example: 2
 *          500:
 *              description: Server fails on some operation, try later
 */

users.post('/count', (req, res, next) => {
    UserEntity.findAndCountAll()
        .then((value) => res.status(200).send({count: value.count}))
        .catch((err) => next(err));
});
