import {
  isBase64,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsCursor(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types -- Method decorator using Object as the main type
  return function (target: Object, propertyName: string): void {
    registerDecorator({
      name: IsCursor.name,
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isBase64(value);
        },
        defaultMessage(validationArguments?: ValidationArguments) {
          return `${
            validationArguments?.property ?? 'Key'
          } is not a valid cursor`;
        },
      },
    });
  };
}
