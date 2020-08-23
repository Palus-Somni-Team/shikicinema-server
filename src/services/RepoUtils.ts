import {Transaction, TransactionOptions} from 'sequelize';
import {sequelize} from '../sequelize';

export class RepoUtils {
    public static async getTxOptions(tx?: Transaction): Promise<TransactionOptions> {
        return {transaction: tx ?? await sequelize.transaction()} as TransactionOptions;
    }
}
