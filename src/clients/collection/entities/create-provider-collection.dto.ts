import { Types } from 'mongoose';
import { IsNumber, IsString } from 'class-validator';

export class CreateLearningRoadmapDto {
  @IsNumber()
  day: number;

  @IsString({
    each: true,
  })
  vocabularies: string[];
}

export class CreateProviderCollectionDto {
  @IsString()
  name: string;

  @IsNumber()
  fee: number;

  roadmaps: Record<string, Types.ObjectId[]>;
}
