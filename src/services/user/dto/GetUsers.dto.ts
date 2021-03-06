import { Exclude, Expose, Type } from 'class-transformer';
import { GetUsersRequest, Role } from '@lib-shikicinema';
import { IsArray, IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { TransformDate, TransformNullableString, TransformRoles } from '@app-utils/class-transform.utils';

@Exclude()
export class GetUsers implements GetUsersRequest {
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    id?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(5, 32)
    login?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(5, 32)
    name?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    email?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @TransformNullableString()
    shikimoriId?: string | null;

    @Expose()
    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @TransformRoles()
    roles?: Role[];

    @Expose()
    @IsOptional()
    @IsDate()
    @TransformDate()
    createdAt?: Date;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number;
}
