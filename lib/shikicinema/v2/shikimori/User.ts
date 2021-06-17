export interface IShikimoriUserImage {
  x160: string;
  x148: string;
  x80: string;
  x64: string;
  x48: string;
  x32: string;
  x16: string;
}

export interface IShikimoriUser {
  id: string;
  nickname: string;
  avatar: string;
  image: IShikimoriUserImage;
  last_online_at: string;
  url: string;
  name: string;
  sex: 'male' | 'female' | null;
  website: string;
  // YYYY-MM-DD
  birth_on: string;
  locale: string;
}
