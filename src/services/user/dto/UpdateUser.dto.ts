import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role, UpdateUserRequest } from '@lib-shikicinema';
import { TransformNullableString, TransformRoles } from '@app-utils/class-transform.utils';

export class UpdateUser implements UpdateUserRequest {
    @IsOptional()
    @IsString()
    @Length(5, 32)
    @ApiProperty({
        minimum: 5,
        maximum: 32,
    })
    name: string;

    @IsOptional()
    @IsString()
    @Length(5, 64)
    @ApiProperty({
        minimum: 5,
        maximum: 64,
    })
    password: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ format: 'email' })
    email: string;

    @IsOptional()
    @IsString()
    @TransformNullableString()
    @ApiProperty({ nullable: true })
    shikimoriId: string | null;

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
