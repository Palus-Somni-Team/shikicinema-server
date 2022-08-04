import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const AnimeEpisodeInfoSchema: SchemaObject = {
    type: 'object',
    example: {
        1: {
            domains: ['youtube.com'],
            kinds: [0],
        },
        2: {
            domains: ['youtube.com'],
            kinds: [0],
        },
        3: {
            domains: ['youtube.com'],
            kinds: [0],
        },
    },
    additionalProperties: {
        type: 'object',
        properties: {
            domains: {
                type: 'array',
                items: {
                    type: 'string',
                },
            },
            kinds: {
                type: 'array',
                items: {
                    type: 'number',
                },
            },
        },
    },
};
