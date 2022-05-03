import { ObjectId } from '@mongoose/type';
import { LeanDocument } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './user.model';

export const UserServiceToken = 'UserService';

export interface UserService {
  findByEmail(
    email: string,
  ): Promise<LeanDocument<UserDocument & ObjectId> | null>;
  createOne(createUserDto: CreateUserDto): Promise<UserDocument & ObjectId>;
}
