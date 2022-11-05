import { AuthorEntity } from '@app-entities/author';
import { SessionEntity } from '@app-entities/session';
import { UploadTokenEntity } from '@app-entities/upload-token';
import { UploaderEntity } from '@app-entities/uploader';
import { UserEntity } from '@app-entities/user';
import { VideoEntity } from '@app-entities/video';

export const entities = [
    AuthorEntity,
    UserEntity,
    UploaderEntity,
    UploadTokenEntity,
    SessionEntity,
    VideoEntity,
];

export { AuthorEntity } from '@app-entities/author';
export { SessionEntity } from '@app-entities/session';
export { UploadTokenEntity } from '@app-entities/upload-token';
export { UploaderEntity } from '@app-entities/uploader';
export { UserEntity } from '@app-entities/user';
export { VideoEntity } from '@app-entities/video';
