import { ConflictException } from '@nestjs/common';

export class AlreadyExistsException extends ConflictException {
    constructor(message?: string) {
        super(message ? message : 'Object already exists');
    }
}
