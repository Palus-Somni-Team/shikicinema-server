//
// V1
//

//
// V2
//

import { DataResponse } from './v2/DataResponse';

export { PaginationRequest } from './v2/PaginationRequest';
export { LoginRequest } from './v2/LoginRequest';

//
// Author
//

import { Author } from './v2/author/Author';

export { Author };
export { GetAuthorsRequest } from './v2/author/GetAuthorsRequest';

/**
 * Represents response for {@link GetAuthorsRequest} request.
 */
export type GetAuthorResponse = DataResponse<Author>;

//
// Videos
//
import { AnimeEpisodeInfo } from './v2/videos/AnimeEpisodeInfo';
import { Video } from './v2/videos/Video';

export { GetByIdParamRequest } from './v2/GetByIdParamRequest';
export { Video };
export { AnimeEpisodeInfo };
export { CreateVideoRequest } from './v2/videos/CreateVideoRequest';
export { GetEpisodesRequest } from './v2/videos/GetEpisodesRequest';
export { GetVideosRequest } from './v2/videos/GetVideosRequest';
export { UpdateVideoRequest } from './v2/videos/UpdateVideoRequest';
export { VideoKindEnum } from './v2/videos/VideoKindEnum';
export { VideoQualityEnum } from './v2/videos/VideoQualityEnum';
export { Uploader } from './v2/videos/Uploader';

/**
 * Represents response for {@link GetEpisodesRequest} request.
 */
export type GetEpisodesResponse = DataResponse<AnimeEpisodeInfo>;

/**
 * Represents response for a {@link GetVideosRequest} request.
 */
export type GetVideosResponse = DataResponse<Video>;

//
// Users
//
import { User } from './v2/users/User';

export { CreateUserRequest } from './v2/users/CreateUserRequest';
export { RegisterUserRequest } from './v2/users/RegisterUserRequest';
export { GetUsersRequest } from './v2/users/GetUsersRequest';
export { UpdateUserRequest } from './v2/users/UpdateUserRequest';
export { User };
export { Role } from './v2/users/Role';

export type GetUsersResponse = DataResponse<User>;

//
// For Admin only
//
import { AdminUser } from './v2/users/AdminUser';

export { AdminUser };
export type GetAdminUsersResponse = DataResponse<AdminUser>;

export { IShikimoriUser, IShikimoriUserImage } from './v2/shikimori/User';
