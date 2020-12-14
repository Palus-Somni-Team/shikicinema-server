import { HttpService, Injectable } from '@nestjs/common';
import { IShikimoriUser } from '@shikicinema';
import { ShikimoriUser } from './dto/ShikimoriUser.dto';

export interface IShikimoriClient {
  getUserInfoByToken(token: string): Promise<ShikimoriUser>;
}

@Injectable()
export class ShikimoriClient implements IShikimoriClient {
  constructor(
    private readonly http: HttpService,
  ) {}

  public getUserInfoByToken(token: string): Promise<ShikimoriUser> {
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.get<IShikimoriUser>(`/api/users/whoami`, { headers })
      .toPromise()
      .then((res) => res.data)
      .then((user) => new ShikimoriUser(
        user.id,
        user.avatar,
        user.nickname,
        user.image,
        user.name,
        user.locale,
        user.sex,
        user.url,
        user.website,
        user.last_online_at,
        user.birth_on,
      ));
  }
}
