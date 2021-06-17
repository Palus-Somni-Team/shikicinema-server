import { PaginationRequest } from '@lib-shikicinema';

export type ParsedQuery = {
  where: any;
  limit?: number;
  offset?: number;
};

export function parseWhere(obj: any): ParsedQuery {
  const where = {};
  const { limit, offset } = obj as PaginationRequest;

  delete obj.limit;
  delete obj.offset;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      where[key] = value;
    }
  }

  return {where, limit, offset};
}
