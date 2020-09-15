//
// V1
//

//
// V2
//

import {DataResponse} from './v2/DataResponse';
import {LimitOffsetResponse} from './v2/LimitOffsetResponse';

export {GetByIdParamRequest} from './v2/GetByIdParamRequest';

//
// Videos
//
import {AnimeEpisodeInfo as AnimeEpisodeInfo} from './v2/videos/AnimeEpisodeInfo';
import {Video as Video} from './v2/videos/Video';

export {CreateVideoRequest} from './v2/videos/CreateVideoRequest';
export {DeleteVideoRequest} from './v2/videos/DeleteVideoRequest';
export {GetEpisodesRequest} from './v2/videos/GetEpisodesRequest';
export {GetVideosRequest} from './v2/videos/GetVideosRequest';
export {UpdateVideoRequest} from './v2/videos/UpdateVideoRequest';
export {VideoKind} from './v2/videos/VideoKind';
export {VideoQuality} from './v2/videos/VideoQuality';

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
export {CreateUserRequest} from './v2/users/CreateUserRequest';
export {GetUsersRequest} from './v2/users/GetUsersRequest';
export {PaginationRequest} from './v2/PaginationRequest';
export {UpdateUserRequest} from './v2/users/UpdateUserRequest';
export {User} from './v2/users/User';
export {Role} from './v2/users/Role';

//
// For Admin only
//
export {AdminUser} from './v2/users/AdminUser';
