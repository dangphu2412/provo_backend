import { TransformationType } from '../transformation/transformation-type.enum';
import {
  ValidationOptions,
  registerDecorator,
  isBase64,
  ValidationArguments,
} from 'class-validator';
import { PaginationContainer } from '../pagination.container';

export function IsCursor(validationOptions?: ValidationOptions) {
  const typeToValidator: Record<
    TransformationType,
    (value: unknown) => boolean
  > = {
    [TransformationType.BASE_64]: isBase64,
  };
  const configStore = PaginationContainer.getConfigStore();
  // eslint-disable-next-line @typescript-eslint/ban-types -- Method decorator using Object as the main type
  return function (target: Object, propertyName: string): void {
    registerDecorator({
      name: IsCursor.name,
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const transformationType = configStore.getTransformationType();
          return typeToValidator[transformationType](value);
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
