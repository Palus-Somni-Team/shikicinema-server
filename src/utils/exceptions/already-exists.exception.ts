import { ConflictException } from '@nestjs/common';

export class AlreadyExistsException extends ConflictException {
    constructor() {
        super('Object already exists');
    }
}
