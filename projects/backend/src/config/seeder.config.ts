import { registerAs } from '@nestjs/config';

import { SeederConfigEnum } from '~backend/modules/seeder/seeder-config.enum';
import { SeederOptions } from '~backend/modules/seeder/seeder-module-config.interface';

export default registerAs('seeder-config', (): SeederOptions => ({
    onRunSeed: process.env.NODE_ENV === 'testing'
        ? SeederConfigEnum.SEED
        : SeederConfigEnum.NOOP,
}));
