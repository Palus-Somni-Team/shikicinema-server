import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import * as passport from 'passport';
import { getRepository } from 'typeorm';
import { AppModule } from './app.module';
import { SessionEntity } from './services/session/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionStorage = new TypeormStore({ cleanupLimit: 2 });

  // TODO: change this
  app.use(
    session({
      name: 'sid',
      secret: 'SESSION_SECRET',
      resave: true,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        // secure: true,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      },
      store: sessionStorage.connect(getRepository(SessionEntity))
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}

bootstrap();
