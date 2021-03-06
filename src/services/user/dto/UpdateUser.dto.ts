import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role, UpdateUserRequest } from '@lib-shikicinema';
import { TransformNullableString, TransformRoles } from '@app-utils/class-transform.utils';

export class UpdateUser implements UpdateUserRequest {
    @IsOptional()
    @IsString()
    @Length(5, 32)
    name: string;

    @IsOptional()
    @IsString()
    @Length(5, 64)
    password: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @TransformNullableString()
    shikimoriId: string | null;

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @TransformRoles()
    roles: Role[];
}
