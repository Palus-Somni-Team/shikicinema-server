import { CreateUserRequest, Role } from '@lib-shikicinema';
import { Exclude, Expose } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { TransformRoles } from '@app-utils/class-transform.utils';

@Exclude()
export class CreateUser implements CreateUserRequest {
    @Expose()
    @IsEmail()
    email: string;

    @Expose()
    @IsString()
    @Length(5, 32)
    login: string;

    @Expose()
    @IsString()
    @Length(5, 64)
    password: string;

    @Expose()
    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @TransformRoles()
    roles: Role[];
}
