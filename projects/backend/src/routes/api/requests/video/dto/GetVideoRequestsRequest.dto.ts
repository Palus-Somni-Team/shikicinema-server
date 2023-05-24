import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsInt,
    IsOptional,
    Max,
    Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
    GetVideoRequestsRequest as Interface, VideoRequestStatusEnum, VideoRequestTypeEnum,
} from '@shikicinema/types';

export class GetVideoRequestsRequest implements Interface {
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

    @Expose()
    @IsInt()
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ required: false })
    id?: number;

    @Expose()
    @ArrayMinSize(1)
    @ArrayMaxSize(2)
    @IsOptional()
    @ApiProperty({ required: false })
    types?: VideoRequestTypeEnum[];

    @Expose()
    @ArrayMinSize(1)
    @ArrayMaxSize(3)
    @IsOptional()
    @ApiProperty({ required: false })
    statuses?: VideoRequestStatusEnum[];

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ required: false })
    createdBy?: number;

    @Expose()
    @IsOptional()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ required: false })
    reviewedBy?: number;
}
