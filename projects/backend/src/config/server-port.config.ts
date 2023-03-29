import { registerAs } from '@nestjs/config';

export const SERVER_DEFAULT_PORT = '14322';
export default registerAs('server-port', async () => process.env.SHIKICINEMA_SERVER_PORT || SERVER_DEFAULT_PORT);
