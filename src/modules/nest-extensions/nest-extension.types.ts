import { Type, DynamicModule, ForwardReference } from '@nestjs/common';

export type NestModuleRegister = Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
>;
