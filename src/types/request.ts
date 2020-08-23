import {ParsedQs} from 'qs';
import {ParamsDictionary} from 'express-serve-static-core';
import {Request} from 'express';


export type BodyRequest<T> = Request<ParamsDictionary, any, T, ParsedQs>;
export type QueryRequest<T> = Request<ParamsDictionary, any, any, T>;
