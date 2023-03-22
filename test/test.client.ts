import * as request from 'supertest';

import {
    CreateVideoRequest,
    GetAdminUsersResponse,
    GetAuthorResponse,
    GetAuthorsRequest,
    GetEpisodesResponse,
    GetVideosRequest,
    GetVideosResponse,
    LoginRequest,
    RegisterUserRequest,
    UpdateVideoRequest,
} from '@lib-shikicinema';
import { GetEpisodesRequest, SearchVideosRequest, VideoResponse } from '@app-routes/api/video/dto';
import { OwnerUserInfo } from '@app-routes/auth/dto';
import { VideoEntity } from '@app-entities';

export class TestClient {
    private readonly server: any;
    private readonly headers: Map<string, string>;
    private readonly cookies: Set<string> = new Set<string>();

    constructor(server: any, headers: Map<string, string> = null) {
        this.server = server;
        this.headers = headers ?? new Map<string, string>();
    }

    //#region HTTP

    private post(url: string, data?: string | object, callback?: request.CallbackHandler) {
        let req = request(this.server).post(url, callback);
        req = this.setHeaders(req);
        return req.send(data);
    }

    private get(url: string, payload?: any, callback?: request.CallbackHandler): request.Test {
        let req = request(this.server).get(url, callback);
        if (payload) req = req.query(payload);
        req = this.setHeaders(req);
        return req.send();
    }

    private delete(url: string, callback?: request.CallbackHandler): request.Test {
        let req = request(this.server).delete(url, callback);
        req = this.setHeaders(req);
        return req.send();
    }

    private patch(url: string, data?: string | object, callback?: request.CallbackHandler): request.Test {
        let req = request(this.server).patch(url, callback);
        req = this.setHeaders(req);
        return req.send(data);
    }

    private setHeaders(req: request.Test): request.Test {
        for (const [key, value] of this.headers?.entries()) {
            req.set(key, value);
        }

        req.set('Cookie', Array.from(this.cookies));
        return req;
    }

    private async extractCookies(response: request.Response) {
        const cookie = (await response).get('Set-Cookie');
        if (cookie?.length >= 0) cookie.forEach((_) => this.cookies.add(_));
    }

    //#endregion HTTP

    //#region Auth

    public async loginRaw(req: LoginRequest) {
        const res = this.post('/auth/login', req);

        await this.extractCookies(await res);
        return res;
    }

    public async login(req: LoginRequest): Promise<OwnerUserInfo> {
        return this.checkResponse(await this.loginRaw(req));
    }

    public meRaw(): request.Test {
        return this.get('/auth/me');
    }

    public async me(): Promise<OwnerUserInfo> {
        return this.checkResponse(await this.meRaw());
    }

    public async logout() {
        return this.post('/auth/logout');
    }

    public async registerRaw(req: RegisterUserRequest) {
        const res = this.post('/auth/register', req);

        await this.extractCookies(await res);
        return res;
    }

    public async register(req: RegisterUserRequest): Promise<OwnerUserInfo> {
        return this.checkResponse(await this.registerRaw(req));
    }

    //#endregion Auth

    //#region Admin

    public getUsersRaw(): request.Test {
        return this.get('/api/admin/users');
    }

    public getUsers(): Promise<GetAdminUsersResponse> {
        return this.checkResponse(this.getUsersRaw());
    }

    public getVideoRaw(id: number): request.Test {
        return this.get(`/api/admin/videos/${id}`);
    }

    public getVideo(id: number): Promise<VideoResponse> {
        return this.checkResponse(this.getVideoRaw(id));
    }

    public deleteVideoRaw(id: number): request.Test {
        return this.delete(`/api/admin/videos/${id}`);
    }

    public deleteVideo(id: number): Promise<void> {
        return this.checkResponse(this.deleteVideoRaw(id));
    }

    public updateVideoRaw(id: number, req: UpdateVideoRequest): request.Test {
        return this.patch(`/api/admin/videos/${id}`, req);
    }

    public updateVideo(id: number, req: UpdateVideoRequest): Promise<VideoResponse> {
        return this.checkResponse(this.updateVideoRaw(id, req));
    }

    //#endregion Admin

    //#region Video

    public getVideosByEpisodeRaw(req: GetVideosRequest): request.Test {
        return this.get('/api/videos', req);
    }

    public getVideosByEpisode(req: GetVideosRequest): Promise<GetVideosResponse> {
        return this.checkResponse(this.getVideosByEpisodeRaw(req));
    }

    public getVideoInfoRaw(req: GetEpisodesRequest): request.Test {
        return this.get('/api/videos/info', req);
    }

    public getVideoInfo(req: GetEpisodesRequest): Promise<GetEpisodesResponse> {
        return this.checkResponse(this.getVideoInfoRaw(req));
    }

    public createVideoRaw(req: CreateVideoRequest): request.Test {
        return this.post('/api/videos', req);
    }

    public async createVideo(req: CreateVideoRequest): Promise<VideoEntity> {
        return this.checkResponse(this.createVideoRaw(req));
    }

    public watchVideoRaw(id: number): request.Test {
        return this.patch(`/api/videos/${id}/watch`);
    }

    public watchVideo(id: number): Promise<void> {
        return this.checkResponse(this.watchVideoRaw(id));
    }

    public searchVideoRaw(req: SearchVideosRequest): request.Test {
        return this.get('/api/videos/search', req);
    }

    public searchVideo(req: SearchVideosRequest): Promise<GetVideosResponse> {
        return this.checkResponse(this.searchVideoRaw(req));
    }

    //#endregion Video

    //#region Author

    public getAuthorsRaw(req: GetAuthorsRequest): request.Test {
        return this.get('/api/authors', req);
    }

    public getAuthors(req?: GetAuthorsRequest): Promise<GetAuthorResponse> {
        return this.checkResponse(this.getAuthorsRaw(req));
    }

    //#endregion Author

    //#region OAuth

    public getAccessTokenRaw(provider: string): request.Test {
        return this.get(`/oauth/${provider}`);
    }

    /* <b>NOTE</b>: you will not normally go here on your own
    only redirect from provider after oauth client authorization consent */
    public getCallbackRaw(provider: string): request.Test {
        return this.get(`/oauth/${provider}/callback`);
    }

    public refreshTokenRaw(provider: string, refresh: string): request.Test {
        return this.get(`/oauth/${provider}/refresh?refreshToken=${refresh}`);
    }

    //#endregion OAuth

    //#region Util

    public async checkResponse<T>(response: request.Test | request.Response): Promise<T> {
        const res = await response;
        expect(res.status >= 200 && res.status < 300);
        return res.body;
    }

    //#endregion Util
}
