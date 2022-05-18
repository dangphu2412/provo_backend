import { ObjectId } from '@mongoose/type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@user-client/dto/create-user.dto';
import { User } from '@user-client/user.model';
import { UserService } from '@user-client/user.service';
import { Model, LeanDocument } from 'mongoose';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createOne(dto: CreateUserDto) {
    return (await this.userModel.create(dto)).save();
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean().exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).lean().exec();
  }

  async updateOne(user: LeanDocument<User & ObjectId>): Promise<void> {
    await this.userModel.updateOne({ _id: user._id }, user).exec();
  }
}
