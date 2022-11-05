import { ArgumentNullException } from '@app-utils/exceptions/argument-null.exception';
import { Check } from '@app-utils/validation/check';

export class Assert {
    public static Argument<T>(name: string, value: T): Check<T> {
        if (value === undefined || value === null) {
            throw new ArgumentNullException(name);
        }

        return new Check<T>(name, value);
    }
}
