import { PaginationRequest } from '@lib-shikicinema';

export type ParsedQuery = {
    where: any;
    limit?: number;
    offset?: number;
};

export function parseWhere<T extends PaginationRequest>(obj: T): ParsedQuery {
    const where = {};
    const { limit, offset } = obj;

    delete obj.limit;
    delete obj.offset;

    for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
            where[key] = value;
        }
    }

    return { where, limit, offset };
}
