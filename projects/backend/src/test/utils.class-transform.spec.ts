import { TransformNullableString } from '~backend/utils/class-transform.utils';
import { plainToClass } from 'class-transformer';

class TestTransformNullableString {
    @TransformNullableString()
        test: string | null;

    constructor(test: string = undefined) {
        this.test = test;
    }
}

describe('Utils class-transform', () => {
    describe('TransformNullableString', () => {
        const meaningfulStrings = [' ', '?', 'wtf', 'русский', '122334534'];

        it('should deserialize undefined value as undefined', () => {
            const classTestUndefined = plainToClass(TestTransformNullableString, { test: undefined });
            expect(classTestUndefined.test).toStrictEqual(undefined);
        });

        it('should deserialize null as null', () => {
            const classTestNull = plainToClass(TestTransformNullableString, { test: null });
            expect(classTestNull.test).toStrictEqual(null);
        });

        it('should deserialize empty string as null', () => {
            const classTestEmpty = plainToClass(TestTransformNullableString, { test: '' });
            expect(classTestEmpty.test).toStrictEqual(null);
        });

        for (const str of meaningfulStrings) {
            const classTestString = plainToClass(TestTransformNullableString, { test: str });
            it(`should deserialize '${str}' as is`, () => {
                expect(classTestString.test).toStrictEqual(str);
            });
        }
    });
});
