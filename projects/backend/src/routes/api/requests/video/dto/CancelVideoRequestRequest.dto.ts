import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CancelVideoRequestRequest as Interface } from '@shikicinema/types';
import { IsInt, Min } from 'class-validator';

export class CancelVideoRequestRequest implements Interface {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0 })
    id: number;
}
