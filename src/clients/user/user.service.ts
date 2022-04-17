import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.model';

export const UserServiceToken = 'UserService';

export interface UserService {
  findByEmail(email: string): Promise<User>;
  createOne(createUserDto: CreateUserDto): Promise<UserDocument>;
}
