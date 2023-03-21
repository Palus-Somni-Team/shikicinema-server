import { Author } from './v2/author';
import { AnimeEpisodeInfo, Video } from './v2/videos';
import { AdminUser, User } from './v2/users';
import { DataResponse } from './v2/DataResponse';

/**
 * Represents response for {@link GetAuthorsRequest} request.
 */
export type GetAuthorResponse = DataResponse<Author>;

/**
 * Represents response for a {@link GetVideosRequest} request.
 */
export type GetVideosResponse = DataResponse<Video>;


/**
 * Represents response for {@link GetEpisodesRequest} request.
 */
export type GetEpisodesResponse = DataResponse<AnimeEpisodeInfo>;

export type GetUsersResponse = DataResponse<User>;

export type GetAdminUsersResponse = DataResponse<AdminUser>;

// all other exports
export * from './v2/author';
export * from './v2/shikimori';
export * from './v2/users';
export * from './v2/videos';
export * from './v2/DataResponse';
export * from './v2/GetByIdParamRequest';
export * from './v2/LoginRequest';
export * from './v2/PaginationRequest';
