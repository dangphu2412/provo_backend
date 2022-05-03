import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@user-client/dto/create-user.dto';
import { User, UserDocument } from '@user-client/user.model';
import { UserService } from '@user-client/user.service';
import { Model } from 'mongoose';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createOne(dto: CreateUserDto) {
    return await this.userModel.create(dto);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).lean();
  }
}
