import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Min,
} from 'class-validator';
import { Uploader } from '@shikicinema/types';

import { IsNullable, ToBoolean } from '~backend/utils/class-transform.utils';

@Exclude()
export class PatchUploaderRequest implements Partial<Omit<Uploader, 'id'>> {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @IsNullable()
    @IsOptional()
    @ApiProperty({ required: false })
    userId?: number | null;

    @Expose()
    @IsString()
    @Length(1, 256)
    @IsOptional()
    @ApiProperty({ required: false })
    shikimoriId?: string;

    @Expose()
    @IsBoolean()
    @IsOptional()
    @ToBoolean()
    @ApiProperty({ required: false })
    banned?: boolean;
}
