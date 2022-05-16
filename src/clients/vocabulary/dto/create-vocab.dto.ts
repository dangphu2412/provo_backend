import { Field, InputType } from '@nestjs/graphql';
import { Definition } from '@vocabulary-client/vocabulary.model';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { DefinitionDto } from './definition.dto';

@InputType()
export class CreateVocabDto {
  @Field()
  @IsString()
  public word: string;

  @Field(() => [DefinitionDto])
  @ValidateNested({ each: true })
  @Type(() => DefinitionDto)
  public definitions: Definition[];
}
