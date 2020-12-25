import { SessionEntity } from './session';
import { UploadTokenEntity } from './upload-token';
import { UploaderEntity } from './uploader';
import { UserEntity } from './user';
import { VideoEntity } from './video';

export { SessionEntity } from './session';
export { UploadTokenEntity } from './upload-token';
export { UploaderEntity } from './uploader';
export { UserEntity } from './user';
export { VideoEntity } from './video';


export const entities = [
    UserEntity,
    UploaderEntity,
    UploadTokenEntity,
    SessionEntity,
    VideoEntity,
];
