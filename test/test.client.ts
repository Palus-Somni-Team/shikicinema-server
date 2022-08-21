import * as request from 'supertest';
import {
    AnimeEpisodeInfo,
    CreateVideoRequest,
    GetVideosRequest,
    LoginRequest,
    RegisterUserRequest,
    UpdateVideoRequest,
} from '@lib-shikicinema';

import { AdminUserInfo } from '@app-routes/api/admin/user/dto/AdminUserInfo.dto';
import { GetVideosInfoRequest, SearchVideosRequest, VideoResponse } from '@app-routes/api/video/dto';
import { OwnerUserInfo } from '@app-routes/auth/dto/OwnerUserInfo';
import { VideoEntity } from '@app-entities';
import { queryString } from '@app-utils/http.utils';

export class TestClient {
    private readonly server: any;
    private readonly headers: Map<string, string>;

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

    private get(url: string, callback?: request.CallbackHandler): request.Test {
        let req = request(this.server).get(url, callback);
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

        return req;
    }

    private async extractCookies(response: request.Response) {
        const cookie = (await response).get('Set-Cookie');

        if (cookie?.length >= 0) {
            this.headers.set('Cookie', cookie[0]);
        }
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

    public getUsers(): Promise<AdminUserInfo[]> {
        return this.checkResponse(this.getUsersRaw());
    }

    public getVideosRaw(id: number): request.Test {
        return this.get(`/api/admin/videos/${id}`);
    }

    public getVideos(id: number): Promise<VideoResponse> {
        return this.checkResponse(this.getVideosRaw(id));
    }

    public deleteVideosRaw(id: number): request.Test {
        return this.delete(`/api/admin/videos/${id}`);
    }

    public deleteVideos(id: number): Promise<void> {
        return this.checkResponse(this.deleteVideosRaw(id));
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
        return this.get(`/api/videos${queryString(req)}`);
    }

    public getVideosByEpisode(req: GetVideosRequest): Promise<VideoEntity[]> {
        return this.checkResponse(this.getVideosByEpisodeRaw(req));
    }

    public getVideosInfoRaw(req: GetVideosInfoRequest): request.Test {
        return this.get(`/api/videos/info${queryString(req)}`);
    }

    public getVideosInfo(req: GetVideosInfoRequest): Promise<AnimeEpisodeInfo> {
        return this.checkResponse(this.getVideosInfoRaw(req));
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
        return this.get(`/api/videos/search${queryString(req)}`);
    }

    public searchVideo(req: SearchVideosRequest): Promise<VideoEntity[]> {
        return this.checkResponse(this.searchVideoRaw(req));
    }

    //#endregion Video

    //#region Util

    public async checkResponse<T>(response: request.Test | request.Response): Promise<T> {
        const res = await response;
        expect(res.status >= 200 && res.status < 300);
        return res.body;
    }

    //#endregion Util
}
