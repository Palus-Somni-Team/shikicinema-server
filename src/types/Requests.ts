import {Request} from 'express';
import core from 'express-serve-static-core';

export type ParamsRequest<T extends core.Params> = Request<T>;
export type BodyRequest<T> = Request<core.Params, any, T>;
export type QueryRequest<T> = Request<core.Params, any, any, T>
