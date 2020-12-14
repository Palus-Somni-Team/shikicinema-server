import { Request } from 'express';

export interface IRequest extends Request {
  /**
   * @description ID of authenticated user
   */
  user: number;
}
