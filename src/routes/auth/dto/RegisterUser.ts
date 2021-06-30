import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { RegisterUserRequest } from '@lib-shikicinema';

@Exclude()
export class RegisterUser implements RegisterUserRequest {
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
}
