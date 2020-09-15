import { Role, UpdateUserRequest } from '@shikicinema';
import { TransformNullableString, TransformRoles } from '@utils/class-transform.utils';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUser implements UpdateUserRequest {
  @IsOptional()
  @IsString()
  @Length(5, 32)
  name: string;

  @IsOptional()
  @IsString()
  @Length(5, 64)
  password: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @TransformNullableString()
  shikimoriId: string | null;

  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @TransformRoles()
  roles: Role[];
}
