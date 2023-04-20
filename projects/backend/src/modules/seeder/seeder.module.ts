import {
    DynamicModule,
    Module,
    OnApplicationBootstrap,
    Provider,
} from '@nestjs/common';

import { SEEDER_TOKEN } from '~backend/modules/seeder/seeder.constans';
import {
    SeederAsyncOptions,
    SeederOptions,
    SeederOptionsFactory,
} from '~backend/modules/seeder/seeder-module-config.interface';
import { SeederConfigEnum } from '~backend/modules/seeder/seeder-config.enum';
import { SeederService } from '~backend/modules/seeder/seeder.service';

const defaultSeederConfig: SeederOptions = {
    onRunSeed: SeederConfigEnum.NOOP,
};

const seederFactory: Provider = {
    provide: SEEDER_TOKEN,
    useValue: defaultSeederConfig,
};

@Module({
    providers: [seederFactory, SeederService],
})
export class SeederModule implements OnApplicationBootstrap {
    constructor(
        readonly seederService: SeederService,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        await this.seederService.runAllSeedsOrNoop();
    }

    public static forRootAsync(config: SeederAsyncOptions): DynamicModule {
        return {
            module: SeederModule,
            imports: config.imports ?? [],
            providers: [...this.createProviders(config)],
        };
    }

    private static createProviders(options: SeederAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }

        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createOptionsProvider(options: SeederAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: SEEDER_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        return {
            provide: SEEDER_TOKEN,
            useFactory: async ({ createSeederOptions }: SeederOptionsFactory) => createSeederOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
