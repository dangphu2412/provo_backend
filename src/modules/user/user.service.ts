import { ObjectId } from '@mongoose/type';
import { InjectModel } from '@nestjs/mongoose';
import { CreateGoogleUserDto } from '@user-client/dto/create-user.dto';
import { User } from '@user-client/user.model';
import { UserService } from '@user-client/user.service';
import { LeanDocument, Model } from 'mongoose';

export class UserServiceImpl implements UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  createOne(dto: CreateGoogleUserDto) {
    return this.userModel.create(dto);
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
