import { BadRequestException } from '@nestjs/common';

export class AlreadyExistsException extends BadRequestException {
    constructor() {
        super('Object already exists');
    }
}
