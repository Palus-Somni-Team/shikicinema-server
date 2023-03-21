import { IsNonNullableOptional } from '~backend/utils/class-validate.utils';
import { validateSync } from 'class-validator';

class TestTransformNullableString {
    @IsNonNullableOptional()
        test: string;

    constructor(test: string = undefined) {
        this.test = test;
    }
}

describe('Utils class-validate', () => {
    describe('IsNonNullableOptional', () => {
        const meaningfulStrings = ['', ' ', '?', 'wtf', 'русский', '122334534'];

        it('should pass validation for "undefined"', () => {
            const nonNullableOptTest = validateSync(new TestTransformNullableString(undefined));
            expect(nonNullableOptTest).toStrictEqual([]);
        });

        it('should not pass validation for "null"', () => {
            const nonNullableOptTest = validateSync(new TestTransformNullableString(null));
            expect(nonNullableOptTest).toStrictEqual([]);
        });

        for (const str of meaningfulStrings) {
            it(`should pass validation for "${str}"`, () => {
                const nonNullableOptTest = validateSync(new TestTransformNullableString(str));
                expect(nonNullableOptTest).toStrictEqual([]);
            });
        }
    });
});
