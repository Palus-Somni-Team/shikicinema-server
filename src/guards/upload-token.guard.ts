import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UploadTokenGuard extends AuthGuard('bearer') {}
