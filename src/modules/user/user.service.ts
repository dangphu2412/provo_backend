import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@user-client/dto/create-user.dto';
import { User, UserDocument } from '@user-client/user.model';
import { UserService } from '@user-client/user.service';
import { Model } from 'mongoose';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createOne(dto: CreateUserDto): Promise<UserDocument> {
    return await this.userModel.create(dto);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).lean();
  }
}
