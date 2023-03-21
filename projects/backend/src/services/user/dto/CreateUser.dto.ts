import { ApiProperty } from '@nestjs/swagger';
import { CreateUserRequest, Role } from '@shikicinema/types';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TransformRoles } from '~backend/utils/class-transform.utils';

@Exclude()
export class CreateUser implements CreateUserRequest {
    @Expose()
    @IsEmail()
    @ApiProperty({ format: 'email' })
    email: string;

    @Expose()
    @IsString()
    @Length(5, 32)
    @ApiProperty({
        minimum: 5,
        maximum: 32,
    })
    login: string;

    @Expose()
    @IsString()
    @Length(5, 64)
    @ApiProperty({
        minimum: 5,
        maximum: 64,
    })
    password: string;

    @Expose()
    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @TransformRoles()
    @ApiProperty({
        enum: Role,
        isArray: true,
    })
    roles: Role[];
}
