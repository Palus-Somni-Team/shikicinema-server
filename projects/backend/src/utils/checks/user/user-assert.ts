import { Check } from '~backend/utils/checks/check';
import { UserAssertionValidator } from '~backend/utils/checks/user/user-assertion-validator';

export class UserAssert {
    public static check<T>(name: string, value: T): Check<T> {
        return UserAssertionValidator.instance.checkValue(name, value);
    }
}
