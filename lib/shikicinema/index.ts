//
// V1
//

//
// V2
//

import { DataResponse } from './v2/DataResponse';
import { LimitOffsetResponse } from './v2/LimitOffsetResponse';

export { LoginRequest } from './v2/LoginRequest';

//
// Author
//

export { Author } from './v2/author/Author';

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
export type GetEpisodesResponse = LimitOffsetResponse<AnimeEpisodeInfo>;

/**
 * Represents response for a {@link GetVideosRequest} request.
 */
export type GetVideosResponse = DataResponse<Video>;

//
// Users
//
export { CreateUserRequest } from './v2/users/CreateUserRequest';
export { RegisterUserRequest } from './v2/users/RegisterUserRequest';
export { GetUsersRequest } from './v2/users/GetUsersRequest';
export { PaginationRequest } from './v2/PaginationRequest';
export { UpdateUserRequest } from './v2/users/UpdateUserRequest';
export { User } from './v2/users/User';
export { Role } from './v2/users/Role';

//
// For Admin only
//
export { AdminUser } from './v2/users/AdminUser';

export { IShikimoriUser, IShikimoriUserImage } from './v2/shikimori/User';
