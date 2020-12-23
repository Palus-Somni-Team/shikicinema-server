import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {

  serializeUser(userId: number, done: (err: Error, user: number) => void): any {
    done(null, userId);
  }

  deserializeUser(userId: number, done: (err: Error, payload: number) => void): any {
    done(null, userId);
  }
}
