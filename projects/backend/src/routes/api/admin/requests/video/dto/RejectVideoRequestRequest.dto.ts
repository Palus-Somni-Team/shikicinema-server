import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RejectVideoRequestRequest as Interface } from '@shikicinema/types';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class RejectVideoRequestRequest implements Interface {
    @Expose()
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({ minimum: 0 })
    id: number;

    @Expose()
    @IsString()
    @IsOptional()
    @Length(1, 1000)
    @ApiProperty({
        minLength: 15,
        maxLength: 1000,
    })
    comment?: string;
}
