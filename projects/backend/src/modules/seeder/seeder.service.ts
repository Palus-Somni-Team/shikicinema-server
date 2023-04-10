import { DataSource } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { SEEDER_TOKEN } from '~backend/modules/seeder/seeder.constans';
import { SeederConfigEnum } from '~backend/modules/seeder/seeder-config.enum';
import { SeederOptions } from '~backend/modules/seeder/seeder-module-config.interface';

@Injectable()
export class SeederService {
    constructor(
        readonly dataSource: DataSource,
        @Inject(SEEDER_TOKEN) readonly seedingConfig: SeederOptions,
    ) {}

    private _isSeeded = false;

    public get isSeeded() {
        return this._isSeeded;
    }

    public async runAllSeedsOrNoop(): Promise<boolean> {
        if (this.seedingConfig.onRunSeed === SeederConfigEnum.SEED) {
            await this.dataSource.runMigrations();
            this._isSeeded = true;
        }

        return this._isSeeded;
    }
}
