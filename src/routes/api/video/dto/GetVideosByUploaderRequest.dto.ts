import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateIf } from 'class-validator';
import { PaginationRequest } from '@lib-shikicinema';

/**
 * Will validate if at least one of the fields present in query
 */
export class GetVideosByUploaderRequest implements PaginationRequest {
    @Expose()
    @IsInt()
    @ValidateIf((query: GetVideosByUploaderRequest) => !query.shikimoriId || !!query.id)
    @Type(() => Number)
    id?: number;

    @Expose()
    @ValidateIf((query: GetVideosByUploaderRequest) => !!query.shikimoriId || !query.id)
    shikimoriId?: string;

    @Expose()
    @IsInt()
    @IsOptional()
    limit?: number;

    @Expose()
    @IsInt()
    @IsOptional()
    offset?: number;
}
