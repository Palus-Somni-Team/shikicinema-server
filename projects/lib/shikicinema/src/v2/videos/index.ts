import { DataResponse } from '../DataResponse';
import { AnimeEpisodeInfo } from './AnimeEpisodeInfo';
import { Video } from './Video';

/**
 * Represents response for a {@link GetVideosRequest} request.
 */
export type GetVideosResponse = DataResponse<Video>;

/**
 * Represents response for {@link GetEpisodesRequest} request.
 */
export type GetEpisodesResponse = DataResponse<AnimeEpisodeInfo>;

export * from './AnimeEpisodeInfo';
export * from './CreateVideoRequest';
export * from './GetEpisodesRequest';
export * from './GetVideosRequest';
export * from './UpdateVideoRequest';
export * from './Uploader';
export * from './Video';
export * from './VideoKindEnum';
export * from './VideoQualityEnum';
