import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {
    @ApiProperty()
    login: string;

    @ApiProperty()
    password: string;
}
