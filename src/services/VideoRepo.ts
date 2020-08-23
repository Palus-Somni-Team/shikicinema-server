import {Video} from '../../lib/shikicinema/v2/videos/Video';
import {VideoEntity} from '../models/VideoEntity';
import {CreateVideoRequest, UpdateVideoRequest, VideoKind} from '../../lib/shikicinema';
import {EpisodeEntity} from '../models/EpisodeEntity';
import {Transaction, TransactionOptions} from 'sequelize';
import {RepoUtils} from './RepoUtils';
import {AnimeEpisodeInfo} from '../../lib/shikicinema/v2/videos/AnimeEpisodeInfo';

class VideoRepo {
    private static readonly IncludeEpisodes = [{model: EpisodeEntity}];

    public async find(animeId: number, episode: number): Promise<Video[]> {
        const videos = await VideoEntity.findAll({where: {animeId, episode}, include: VideoRepo.IncludeEpisodes});
        return videos.map((_) => VideoRepo.toVideo(_));
    }

    public async findEpisodes(animeId: number, limit = 100, offset = 0): Promise<AnimeEpisodeInfo[]> {
        const episodes = await EpisodeEntity.findAll({
            where: {animeId},
            include: [{model: VideoEntity}],
            limit, offset,
        });

        return episodes.map((_) => VideoRepo.toAnimeEpisodeInfo(_));
    }

    public async create(req: CreateVideoRequest, uploader: number, tx?: Transaction): Promise<Video> {
        const txOptions = await RepoUtils.getTxOptions(tx);
        const episode = await VideoRepo.upsertEpisode(req.animeId, req.episode, txOptions);

        const video = await VideoEntity.create({
            url: req.url,
            kind: req.kind,
            episodeId: episode.id,
            language: req.language,
            quality: req.quality,
            author: req.author,
            uploader: uploader,
        }, {...txOptions, validate: false});

        await txOptions.transaction!.commit();
        return VideoRepo.toVideo(video, episode);
    }


    public async update(req: UpdateVideoRequest, tx?: Transaction): Promise<Video | null> {
        const txOptions = await RepoUtils.getTxOptions(tx);
        const entity = await VideoEntity.findByPk(req.id, {...txOptions, include: VideoRepo.IncludeEpisodes});
        if (entity === null) return null;

        const episode = req.animeId || req.episode
            ? await VideoRepo.upsertEpisode(entity.episode!.animeId, entity.episode!.number, txOptions)
            : null;

        entity.episodeId = episode?.id ?? entity.episodeId;
        entity.url = req.url ?? entity.url;
        entity.author = req.author ?? entity.author;
        entity.kind = req.kind ?? entity.kind;
        entity.quality = req.quality ?? entity.quality;
        entity.language = req.language ?? entity.language;
        entity.uploader = req.uploader ?? entity.uploader;
        entity.watchesCount = req.watchesCount ?? entity.watchesCount;
        await entity.save({...txOptions, validate: false});

        await txOptions.transaction!.commit();
        return VideoRepo.toVideo(entity);
    }

    public delete(id: number): Promise<number> {
        return VideoEntity.destroy({where: {id}});
    }

    private static async upsertEpisode(animeId: number, episode: number, txOptions: TransactionOptions):
        Promise<EpisodeEntity> {
        const entity = new EpisodeEntity();
        entity.animeId = animeId;
        entity.number = episode;
        const [returned, _] = await EpisodeEntity.upsert({entity}, {...txOptions, returning: true});

        return returned;
    }

    private static toVideo(video: VideoEntity, episode?: EpisodeEntity): Video {
        return {
            id: video.id,
            url: video.url,
            domain: new URL(video.url).hostname,
            animeId: video.episode?.animeId ?? episode!.animeId,
            quality: video.quality,
            language: video.language,
            kind: video.kind,
            episode: video.episode?.number ?? episode!.number,
            author: video.author,
            uploader: video.uploader,
            watchesCount: video.watchesCount,
        } as Video;
    }

    private static toAnimeEpisodeInfo(episode: EpisodeEntity): AnimeEpisodeInfo {
        const domains = new Set<string>();
        const kinds = new Set<VideoKind>();
        episode.videos.forEach((_) => {
            domains.add(new URL(_.url).hostname);
            kinds.add(_.kind);
        });

        return {
            animeId: episode.animeId,
            episode: episode.number,
            availableKinds: kinds,
            availableDomains: domains,
        } as AnimeEpisodeInfo;
    }
}

export default new VideoRepo();
