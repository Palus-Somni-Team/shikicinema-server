import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { GetUsersRequest, Role } from '@shikicinema/types';
import { IsArray, IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { TransformDate, TransformNullableString, TransformRoles } from '~backend/utils/class-transform.utils';

@Exclude()
export class GetUsers implements GetUsersRequest {
    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ required: false })
    id?: number;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(5, 32)
    @ApiProperty({
        required: false,
        minimum: 5,
        maximum: 32,
    })
    login?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @Length(5, 32)
    @ApiProperty({
        required: false,
        minimum: 5,
        maximum: 32,
    })
    name?: string;

    @Expose()
    @IsOptional()
    @IsEmail()
    @ApiProperty({
        required: false,
        format: 'email',
    })
    email?: string;

    @Expose()
    @IsOptional()
    @IsString()
    @TransformNullableString()
    @ApiProperty({
        required: false,
        nullable: true,
    })
    shikimoriId?: string | null;

    @Expose()
    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    @TransformRoles()
    @ApiProperty({
        required: false,
        enum: Role,
        isArray: true,
    })
    roles?: Role[];

    @Expose()
    @IsOptional()
    @IsDate()
    @TransformDate()
    @ApiProperty({
        required: false,
        format: 'date',
    })
    createdAt?: Date;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        minimum: 0,
    })
    offset?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @ApiProperty({
        required: false,
        minimum: 1,
        maximum: 100,
        default: 20,
    })
    limit?: number;
}
