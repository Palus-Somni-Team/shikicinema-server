import { Check } from '~backend/utils/checks/check';
import { DevAssertionValidator } from '~backend/utils/checks/dev/dev-assertion-validator';

export class DevAssert {
    public static check<T>(name: string, value: T): Check<T> {
        return DevAssertionValidator.instance.checkValue(name, value);
    }
}
