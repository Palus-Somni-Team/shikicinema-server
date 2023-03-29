import { IShikimoriUser, IShikimoriUserImage } from '@shikicinema/types';

export class ShikimoriUser implements IShikimoriUser {
    public id: string;
    public avatar: string;
    public birthday: Date;
    public image: IShikimoriUserImage;
    public name: string;
    public nickname: string;
    public lastOnline: Date;
    public locale: string;
    public sex: 'male' | 'female' | null;
    public url: string;
    public website: string;
    birth_on: string;
    last_online_at: string;

    constructor(
        id: string,
        avatar: string,
        nickname: string,
        image: IShikimoriUserImage = null,
        name = '',
        locale = 'ru',
        sex: 'male' | 'female' | null = null,
        url: string = null,
        website: string = null,
        last_online_at: string = null,
        birth_on: string = null,
    ) {
        this.id = id;
        this.avatar = avatar;
        this.birthday = birth_on === null ? null : new Date(birth_on);
        this.image = image;
        this.name = name;
        this.nickname = nickname;
        this.lastOnline = last_online_at === null ? null : new Date(last_online_at);
        this.locale = locale;
        this.sex = sex;
        this.url = url;
        this.website = website;
    }
}
