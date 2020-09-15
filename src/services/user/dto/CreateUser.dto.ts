import { CreateUserRequest, Role } from '@shikicinema';
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { TransformRoles } from '@utils/class-transform.utils';

@Exclude()
export class CreateUser implements CreateUserRequest {
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @Length(5, 32)
  login: string;

  @Expose()
  @IsString()
  @Length(5, 64)
  password: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @IsEnum(Role, { each: true })
  @TransformRoles()
  roles: Role[];
}
