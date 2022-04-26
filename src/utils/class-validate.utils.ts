import { ValidateIf } from 'class-validator';

/**
 * @description
 * Would pass undefined values but won't pass null.
 * Use instead @IsOptional() decorator when null values shouldn't pass validation
 *
 * @return {PropertyDecorator} class-validator decorator function
 */
export function IsNonNullableOptional(): PropertyDecorator {
    return ValidateIf((object, value) => value !== undefined);
}
