import { ModuleMetadata, Type } from '@nestjs/common';
import { SeederConfigEnum } from '~backend/modules/seeder/seeder-config.enum';

export interface SeederOptions {
    onRunSeed: SeederConfigEnum
}

export interface SeederOptionsFactory {
    createSeederOptions(): Promise<SeederOptions> | SeederOptions;
}

export interface SeederAsyncOptions extends ModuleMetadata {
    inject?: any[];
    useExisting?: Type<SeederOptions>;
    useClass?: Type<SeederOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<SeederOptions> | SeederOptions;
}
