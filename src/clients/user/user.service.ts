import { ObjectId } from '@mongoose/type';
import { LeanDocument } from 'mongoose';
import { CreateGoogleUserDto } from './dto/create-user.dto';
import { User } from './user.model';

export const UserServiceToken = 'UserService';

export interface UserService {
  findByEmail(email: string): Promise<LeanDocument<User & ObjectId> | null>;
  findById(id: string): Promise<LeanDocument<User & ObjectId> | null>;
  findById(
    id: string,
    relations?: string[],
  ): Promise<LeanDocument<User & ObjectId> | null>;
  createOne(createUserDto: CreateGoogleUserDto): Promise<User & ObjectId>;
  updateOne(user: LeanDocument<User & ObjectId>): Promise<void>;
}
