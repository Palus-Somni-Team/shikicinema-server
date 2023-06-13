import { FindOptionsOrder } from 'typeorm';

export const SORT_BY_ID_ASC: FindOptionsOrder<any> = { id: { direction: 'ASC' } };
export const SORT_BY_ID_DESC: FindOptionsOrder<any> = { id: { direction: 'DESC' } };
