import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { SearchVideosRequest } from '~backend/routes/api/video/dto';

export class AdminSearchVideosRequest extends SearchVideosRequest {
    @Expose()
    @IsOptional()
    @ApiProperty({ required: false })
    includeDeleted?: boolean;
}
