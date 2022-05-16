import { IsNumber, IsString } from 'class-validator';

export class CreateProviderCollectionDto {
  @IsString()
  name: string;

  @IsNumber()
  fee: number;
}
