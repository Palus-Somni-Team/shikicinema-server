import * as request from 'supertest';

import { AdminVideoResponse, UpdateVideoRequest } from '~backend/routes/api/admin/video/dto';
import {
    CreateVideoRequest,
    GetEpisodesRequest,
    GetEpisodesResponse,
    GetVideosRequest,
    GetVideosResponse,
    SearchVideosRequest,
    VideoResponse,
} from '~backend/routes/api/video/dto';
import {
    CreateVideoRequestRequest,
    GetVideoRequestsRequest,
    GetVideoRequestsResponse,
    VideoRequest,
} from '~backend/routes/api/requests/video/dto';
import { GetAdminUsersResponse } from '~backend/routes/api/admin/user/dto';
import { GetAuthorResponse, GetAuthorsRequest } from '~backend/routes/api/author/dto';
import { LoginRequest, OwnerUserInfo, RegisterUser } from '~backend/routes/auth/dto';
import { RejectVideoRequestRequest } from '~backend/routes/api/admin/requests/video/dto';
import { plainToInstance } from 'class-transformer';

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
        return this.checkResponse(OwnerUserInfo, await this.loginRaw(req));
    }

    public meRaw(): request.Test {
        return this.get('/auth/me');
    }

    public async me(): Promise<OwnerUserInfo> {
        return this.checkResponse(OwnerUserInfo, await this.meRaw());
    }

    public async logout() {
        return this.post('/auth/logout');
    }

    public async registerRaw(req: RegisterUser) {
        const res = this.post('/auth/register', req);

        await this.extractCookies(await res);
        return res;
    }

    public async register(req: RegisterUser): Promise<OwnerUserInfo> {
        return this.checkResponse(OwnerUserInfo, await this.registerRaw(req));
    }

    //#endregion Auth

    //#region Admin

    public getUsersRaw(): request.Test {
        return this.get('/api/admin/users');
    }

    public getUsers(): Promise<GetAdminUsersResponse> {
        return this.checkResponse(GetAdminUsersResponse, this.getUsersRaw());
    }

    public getVideoRaw(id: number): request.Test {
        return this.get(`/api/admin/videos/${id}`);
    }

    public getVideo(id: number): Promise<AdminVideoResponse> {
        return this.checkResponse(AdminVideoResponse, this.getVideoRaw(id));
    }

    public deleteVideoRaw(id: number): request.Test {
        return this.delete(`/api/admin/videos/${id}`);
    }

    public deleteVideo(id: number): Promise<void> {
        return this.checkEmptyResponse(this.deleteVideoRaw(id));
    }

    public softDeleteVideoRaw(id: number): request.Test {
        return this.post(`/api/admin/videos/deleted/${id}`);
    }

    public softDeleteVideo(id: number): Promise<void> {
        return this.checkEmptyResponse(this.softDeleteVideoRaw(id));
    }

    public restoreVideoRaw(id: number): request.Test {
        return this.delete(`/api/admin/videos/deleted/${id}`);
    }

    public restoreVideo(id: number): Promise<void> {
        return this.checkEmptyResponse(this.restoreVideoRaw(id));
    }

    public updateVideoRaw(id: number, req: UpdateVideoRequest): request.Test {
        return this.patch(`/api/admin/videos/${id}`, req);
    }

    public updateVideo(id: number, req: UpdateVideoRequest): Promise<AdminVideoResponse> {
        return this.checkResponse(AdminVideoResponse, this.updateVideoRaw(id, req));
    }

    //#endregion Admin

    //#region Video

    public getVideosByEpisodeRaw(req: GetVideosRequest): request.Test {
        return this.get('/api/videos', req);
    }

    public getVideosByEpisode(req: GetVideosRequest): Promise<GetVideosResponse> {
        return this.checkResponse(GetVideosResponse, this.getVideosByEpisodeRaw(req));
    }

    public getVideoInfoRaw(req: GetEpisodesRequest): request.Test {
        return this.get('/api/videos/info', req);
    }

    public getVideoInfo(req: GetEpisodesRequest): Promise<GetEpisodesResponse> {
        return this.checkResponse(GetEpisodesResponse, this.getVideoInfoRaw(req));
    }

    public createVideoRaw(req: CreateVideoRequest): request.Test {
        return this.post('/api/videos', req);
    }

    public async createVideo(req: CreateVideoRequest): Promise<VideoResponse> {
        return this.checkResponse(VideoResponse, this.createVideoRaw(req));
    }

    public watchVideoRaw(id: number): request.Test {
        return this.patch(`/api/videos/${id}/watch`);
    }

    public watchVideo(id: number): Promise<void> {
        return this.checkEmptyResponse(this.watchVideoRaw(id));
    }

    public searchVideoRaw(req: SearchVideosRequest): request.Test {
        return this.get('/api/videos/search', req);
    }

    public searchVideo(req: SearchVideosRequest): Promise<GetVideosResponse> {
        return this.checkResponse(GetVideosResponse, this.searchVideoRaw(req));
    }

    //#endregion Video

    //#region Author

    public getAuthorsRaw(req: GetAuthorsRequest): request.Test {
        return this.get('/api/authors', req);
    }

    public getAuthors(req?: GetAuthorsRequest): Promise<GetAuthorResponse> {
        return this.checkResponse(GetAuthorResponse, this.getAuthorsRaw(req));
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

    //#region Video Requests

    public getVideoRequestsRaw(req: GetVideoRequestsRequest): request.Test {
        return this.get('/api/requests/videos', req);
    }

    public getVideoRequests(req: GetVideoRequestsRequest): Promise<GetVideoRequestsResponse> {
        return this.checkResponse(GetVideoRequestsResponse, this.getVideoRequestsRaw(req));
    }

    public createVideoRequestsRaw(req: CreateVideoRequestRequest): request.Test {
        return this.post('/api/requests/videos', req);
    }

    public createVideoRequests(req: CreateVideoRequestRequest): Promise<VideoRequest> {
        return this.checkResponse(VideoRequest, this.createVideoRequestsRaw(req));
    }

    public cancelVideoRequestsRaw(id: number): request.Test {
        return this.patch(`/api/requests/videos/${id}/cancel`);
    }

    public rejectVideoRequestRaw(req: RejectVideoRequestRequest): request.Test {
        return this.patch('/api/admin/requests/videos/reject', req);
    }

    public rejectVideoRequest(req: RejectVideoRequestRequest): Promise<VideoRequest> {
        return this.checkResponse(VideoRequest, this.rejectVideoRequestRaw(req));
    }

    //#endregion Video Requests

    //#region Util

    public async checkResponse<T>(type: { new(): T }, response: request.Test | request.Response): Promise<T> {
        const res = await response;
        expect(res.status >= 200 && res.status < 300);
        return plainToInstance(type, res.body);
    }

    public async checkEmptyResponse(response: request.Test | request.Response): Promise<void> {
        const res = await response;
        expect(res.status >= 200 && res.status < 300);
    }

    //#endregion Util
}
