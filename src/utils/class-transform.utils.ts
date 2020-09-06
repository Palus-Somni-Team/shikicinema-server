import { Transform } from 'class-transformer';
import { TransformOptions } from 'class-transformer/metadata/ExposeExcludeOptions';
import { Role } from '@shikicinema';

export function TransformNullableString(options?: TransformOptions) {
  return Transform((value) => {
    if (value === undefined) {
      return undefined;
    } else if (value === '' || value === null) {
      return null;
    } else {
      return value;
    }
  }, options);
}

export function TransformRoles() {
  const toPlain = Transform(
    (roles) => roles instanceof Array ? roles.map((role) => Role[Role[role]]) : undefined,
    { toPlainOnly: true }
  );

  const toClass = Transform(
    (roles) => roles instanceof Array ? roles.map((role) => Role[role]) : undefined,
    { toClassOnly: true }
  );

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}

export function TransformDate() {
  const toPlain = Transform((value: Date) => value instanceof Date ? value.toISOString() : null, { toPlainOnly: true });
  const toClass = Transform((value: string) => value ? new Date(value) : undefined, { toClassOnly: true });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}
