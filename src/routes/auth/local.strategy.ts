import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'login',
            passwordField: 'password',
        });
    }

    async validate(login: string, password: string): Promise<number> {
        const user = await this.authService.getUserWithCredentials(login, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user.id;
    }
}
