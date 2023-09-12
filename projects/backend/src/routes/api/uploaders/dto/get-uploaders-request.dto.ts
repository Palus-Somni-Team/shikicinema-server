import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Max,
    Min,
} from 'class-validator';

import { GetUploadersRequest as Request } from '@shikicinema/types';
import { ToBoolean } from '~backend/utils/class-transform.utils';

export class GetUploadersRequest implements Request {
    @Expose()
    @IsInt()
    @Min(0)
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ required: false })
    userId?: number;

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

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        minimum: 0,
        required: false,
        default: 0,
    })
    offset?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    @ApiProperty({
        minimum: 1,
        maximum: 100,
        required: false,
        default: 20,
    })
    limit?: number;
}
