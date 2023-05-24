import { AuthorEntity } from '~backend/entities/author';
import { SessionEntity } from '~backend/entities/session';
import { UploadTokenEntity } from '~backend/entities/upload-token';
import { UploaderEntity } from '~backend/entities/uploader';
import { UserEntity } from '~backend/entities/user';
import { UserRolesEntity } from '~backend/entities/user-roles';
import { VideoEntity } from '~backend/entities/video';
import { VideoRequestEntity } from '~backend/entities/video-request';

export const entities = [
    AuthorEntity,
    UserEntity,
    UploaderEntity,
    UploadTokenEntity,
    SessionEntity,
    VideoEntity,
    UserRolesEntity,
    VideoRequestEntity,
];

export { AuthorEntity } from '~backend/entities/author';
export { SessionEntity } from '~backend/entities/session';
export { UploadTokenEntity } from '~backend/entities/upload-token';
export { UploaderEntity } from '~backend/entities/uploader';
export { UserEntity } from '~backend/entities/user';
export { VideoEntity } from '~backend/entities/video';
export { VideoRequestEntity } from '~backend/entities/video-request';
export { UserRolesEntity } from '~backend/entities/user-roles';
