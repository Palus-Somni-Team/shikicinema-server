import { registerAs } from '@nestjs/config';

export default registerAs('axios-shikimori', () => ({
    baseURL: 'https://shikimori.one',
    headers: {
        'User-Agent': 'Shikicinema Server Auth Service; https://github.com/Palus-Somni-Team/shikicinema-server',
    },
    timeout: 1000,
}),
);
