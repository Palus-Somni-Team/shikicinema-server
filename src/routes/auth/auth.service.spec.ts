import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { IRequest } from './dto/IRequest';
import { RegisterUser } from './dto/RegisterUser';
import { SessionEntity, UploadTokenEntity, UploaderEntity, UserEntity } from '@app-entities';
import { SessionService } from '../../services/session/session.service';
import { ShikimoriAccessToken } from './dto/ShikimoriAccessToken';
import { ShikimoriClient } from '../../services/shikimori/shikimori.client';
import { ShikimoriUser } from '../../services/shikimori/dto/ShikimoriUser.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadTokensService } from '../../services/upload-tokens/upload-tokens.service';
import { UploaderService } from '../../services/uploader/uploader.service';
import { UserService } from '../../services/user/user.service';

describe('AuthService', () => {
    const fakeUserPassword = 'fakeUserPass';
    const fakeUserHashedPassword = bcrypt.hashSync(fakeUserPassword, 10);
    const fakeUserEntity = new UserEntity('fakeUser', fakeUserHashedPassword, 'fake@email.com');
    const fakeRequest = {
        user: 123,
        logout() {
            return;
        },
    } as IRequest;
    const fakeRegisterUserData = {
        email: 'fake@email.org',
        login: 'fake_new_user',
        password: fakeUserPassword,
    } as RegisterUser;
    const sessionEntity = new SessionEntity('1234567890', Date.now(), '');
    const shikimoriUser = new ShikimoriUser('1234567', 'https://shikimori.one/favicon.ico', 'TestUser');
    const shikimoriToken = { token: 'shikimori-token-1234567890' } as ShikimoriAccessToken;
    const uploader = new UploaderEntity(shikimoriUser.id, fakeUserEntity, []);
    const uploadTokenEntity = new UploadTokenEntity('upload-token-1234567', uploader);

    let service: AuthService;
    let mockedUserService: UserService;
    let mockedSessionService: SessionService;
    let mockedShikimoriClient: ShikimoriClient;
    let mockedUploadTokensService: UploadTokensService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findById: jest.fn(),
                        findByLogin: jest.fn(),
                        findAll: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(),
                        update: jest.fn(),
                    },
                },
                {
                    provide: SessionService,
                    useValue: {
                        findById: jest.fn(),
                        revokeById: jest.fn(),
                    },
                },
                {
                    provide: UploadTokensService,
                    useValue: {
                        getByToken: jest.fn(),
                        generateToken: jest.fn(),
                        revoke: jest.fn(),
                        revokeAllFromUploader: jest.fn(),
                    },
                },
                {
                    provide: UploaderService,
                    useValue: {
                        getByShikimoriId: jest.fn(),
                        getByUploaderId: jest.fn(),
                        newShikimoriUploader: jest.fn(),
                        getByUserId: jest.fn(),
                        setBannedStatus: jest.fn(),
                    },
                },
                {
                    provide: ShikimoriClient,
                    useValue: {
                        getUserInfoByToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        mockedUserService = module.get<UserService>(UserService);
        mockedSessionService = module.get<SessionService>(SessionService);
        mockedShikimoriClient = module.get<ShikimoriClient>(ShikimoriClient);
        mockedUploadTokensService = module.get<UploadTokensService>(UploadTokensService);
    });

    describe('getUserWithCredentials', () => {
        it('should succeed in validating credentials and return user', async () => {
            jest.spyOn(mockedUserService, 'findByLogin').mockResolvedValueOnce(fakeUserEntity);
            const user = await service.getUserWithCredentials(fakeUserEntity.login, fakeUserPassword);

            expect(user).toStrictEqual(fakeUserEntity);
        });

        it('should return null for unknown login', async () => {
            jest.spyOn(mockedUserService, 'findByLogin').mockResolvedValueOnce(null);
            const user = await service.getUserWithCredentials('unknown login', 'any password');

            expect(user).toStrictEqual(null);
        });

        it('should return null for incorrect password', async () => {
            jest.spyOn(mockedUserService, 'findByLogin').mockResolvedValueOnce(fakeUserEntity);
            const user = await service.getUserWithCredentials(fakeUserEntity.login, `incorrect ${fakeUserPassword}`);

            expect(user).toStrictEqual(null);
        });

        it('should return null for unexpected error', async () => {
            jest.spyOn(mockedUserService, 'findByLogin').mockRejectedValueOnce(new Error('unexpected'));
            const user = await service.getUserWithCredentials(fakeUserEntity.login, fakeUserPassword);

            expect(user).toStrictEqual(null);
        });
    });

    describe('getLoggedInUser', () => {
        it('should return user from request', async () => {
            jest.spyOn(mockedUserService, 'findById').mockResolvedValueOnce(fakeUserEntity);
            const user = await service.getLoggedInUser(fakeRequest);

            expect(user).toStrictEqual(fakeUserEntity);
        });

        it('should throw NotFoundException for undefined user in request', () => {
            jest.spyOn(mockedUserService, 'findById').mockRejectedValueOnce(new NotFoundException());

            expect(service.getLoggedInUser(fakeRequest)).rejects.toThrowError(NotFoundException);
        });
    });

    describe('getToken', () => {
        it('should return upload token', async () => {
            jest.spyOn(mockedShikimoriClient, 'getUserInfoByToken')
                .mockResolvedValueOnce(shikimoriUser);
            jest.spyOn(mockedUploadTokensService, 'generateToken')
                .mockResolvedValueOnce(uploadTokenEntity);
            const uploadToken = await service.createUploadToken(shikimoriToken);

            expect(uploadToken).toStrictEqual(uploadTokenEntity);
        });

        it('should throw BadRequestException for invalid or expired shikimori access token', () => {
            jest.spyOn(mockedShikimoriClient, 'getUserInfoByToken')
                .mockRejectedValueOnce(new Error('Request Error'));

            expect(service.createUploadToken(shikimoriToken)).rejects.toThrowError(BadRequestException);
        });

        it('should throw ForbiddenException if it was thrown from service', () => {
            jest.spyOn(mockedUploadTokensService, 'generateToken')
                .mockRejectedValueOnce(new ForbiddenException());

            expect(service.createUploadToken(shikimoriToken)).rejects.toThrowError(ForbiddenException);
        });

        it('should throw ConflictException if it was thrown from service', () => {
            jest.spyOn(mockedUploadTokensService, 'generateToken')
                .mockRejectedValueOnce(new ConflictException());

            expect(service.createUploadToken(shikimoriToken)).rejects.toThrowError(ConflictException);
        });

        it('should throw InternalServerErrorException if it was thrown from service', () => {
            jest.spyOn(mockedUploadTokensService, 'generateToken')
                .mockRejectedValueOnce(new InternalServerErrorException());

            expect(service.createUploadToken(shikimoriToken)).rejects.toThrowError(InternalServerErrorException);
        });
    });

    describe('logout', () => {
        it('should logout', () => {
            jest.spyOn(mockedSessionService, 'revokeById').mockResolvedValueOnce(sessionEntity);

            expect(service.logout(fakeRequest)).resolves.not.toThrow();
        });

        it('should throw InternalServerErrorException for unexpected error on session revoking', () => {
            jest.spyOn(mockedSessionService, 'revokeById').mockRejectedValueOnce(new Error('any error'));

            expect(service.logout(fakeRequest)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('register', () => {
        it('should register a new user', async () => {
            jest.spyOn(mockedUserService, 'create').mockResolvedValueOnce(fakeUserEntity);
            const newUser = await service.register(fakeRegisterUserData);

            expect(newUser).toStrictEqual(fakeUserEntity);
        });

        it('should throw ConflictException if it was thrown from service', () => {
            jest.spyOn(mockedUserService, 'create').mockRejectedValueOnce(new ConflictException());

            expect(service.register(fakeRegisterUserData)).rejects.toThrow(ConflictException);
        });

        it('should throw InternalServerErrorException if it was thrown from service', () => {
            jest.spyOn(mockedUserService, 'create').mockRejectedValueOnce(new InternalServerErrorException());

            expect(service.register(fakeRegisterUserData)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
