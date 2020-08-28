import {PathParams} from './PathParams';

/**
 * Interface for the classes representing resource get by id request.
 *
 * @property {number} id     unique identifier of resource to be found.
 */
// "PathParams | {id:number}" is a workaround to trick weird expressjs' generics
export type GetByIdParamRequest = PathParams | {
    id: number;
}
