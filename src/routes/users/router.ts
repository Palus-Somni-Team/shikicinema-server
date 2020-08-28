import {NextFunction, Request, Response, Router} from 'express';
import {UniqueConstraintError} from 'sequelize';

import UserRepo from '../../services/UserRepo';
import {
    CreateUserRequest,
    GetByIdParamRequest,
    GetUsersRequest,
    PaginationRequest,
    UpdateUserRequest,
} from '../../../lib/shikicinema';
import {Validator} from '../../services/validators/Validator';
import CreateUsersRequestValidator from './CreateUsersRequestValidator';
import {ServerErrors} from '../../types/ServerErrors';
import GetUsersRequestValidator from './GetUsersRequestValidator';
import GetResourceByIdRequestValidator from '../../services/validators/GetResourceByIdRequestValidator';
import PutUserRequestValidator from './PutUserRequestValidator';
import DeleteUserRequestValidator from './DeleteUserRequestValidator';
import {BodyRequest, ParamsRequest, QueryRequest} from '../../types/Requests';
import {UserEntity} from '../../models/UserEntity';
import {User} from '../../types/User';

export const users = Router();

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
users.post(
    '/',
    Validator.handle(CreateUsersRequestValidator),
    async (req: BodyRequest<CreateUserRequest>, res: Response, next: NextFunction) => {
        try {
            const requester = await UserRepo.findById(req.session?.user?.id);

            if (!requester?.isAdmin) {
                req.body.roles = ['user']; // do not allow to change roles if not Admin
            }

            const newUser = await UserRepo.create(req.body);

            res.status(201).json(User.toDTO(newUser));
        } catch (e) {
            switch (true) {
                case e instanceof UniqueConstraintError:
                    return next(ServerErrors.USER_EXISTS);
                default:
                    return next(e);
            }
        }
    },
);

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
users.get(
    '/',
    Validator.handle(GetUsersRequestValidator),
    async (req: QueryRequest<GetUsersRequest>, res, next) => {
        try {
            const find: Partial<User> = {
                id: req.query.id,
                name: req.query.name,
                login: req.query.login,
                email: req.query.email,
                roles: req.query.roles,
                shikimoriId: req.query.shikimoriId,
                createdAt: req.query.createdAt,
            };
            const pagination: PaginationRequest = {
                offset: req.query.offset || 0,
                limit: req.query.limit || 20,
            };
            const users = await UserRepo.findAll(find, pagination);
            const dtoUsers = users.map((user) => User.toDTO(user));

            res.status(200).json(dtoUsers);
        } catch (e) {
            next(e);
        }
    },
);

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
users.get(
    '/:id',
    Validator.handle(GetResourceByIdRequestValidator),
    async (req: ParamsRequest<GetByIdParamRequest>, res, next) => {
        try {
            const id = +req.params.id;
            const user = await UserRepo.findById(id);

            if (user) {
                res.status(200).json(User.toDTO(user));
            } else {
                res.status(404).json();
            }
        } catch (e) {
            next(e);
        }
    },
);

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
users.put(
    '/:id',
    Validator.handle(PutUserRequestValidator),
    async (req: Request<GetByIdParamRequest, User, UpdateUserRequest>, res, next) => {
        try {
            const id = +req.params.id;
            const requester = await UserRepo.findById(req.session?.user?.id);

            let updatedUser: UserEntity;
            if (requester?.isAdmin) {
                updatedUser = await UserRepo.upsert(req.body);
            } else if (id === requester?.id) {
                // do not allow to change roles
                req.body.roles = undefined;
                updatedUser = await requester?.update(req.body);
            } else {
                return next(ServerErrors.FORBIDDEN);
            }

            res.status(200).json(User.toDTO(updatedUser));
        } catch (e) {
            next(e);
        }
    },
);

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
users.delete(
    '/:id',
    Validator.handle(DeleteUserRequestValidator),
    async (req: ParamsRequest<GetByIdParamRequest>, res, next) => {
        try {
            const id = +req.params.id;
            const requester = await UserRepo.findById(req.session?.user?.id);

            if (requester?.isAdmin) {
                await UserRepo.delete(id);
            } else if (id == req.session?.user?.id) {
                await requester?.destroy();
            } else {
                return next(ServerErrors.FORBIDDEN);
            }

            res.status(200).json();
        } catch (e) {
            next(e);
        }
    },
);
