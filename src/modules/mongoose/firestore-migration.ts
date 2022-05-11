import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '@user-client/user.model';
import { open, readdir } from 'fs/promises';
import { Model } from 'mongoose';

interface FirestoreUser {
  email: string | null;
  photoURL: string;
  displayName: string;
  uid: string;
}

// interface FirestoreFlashCard {
//   meaning: string;
//   pronounce: string | null;
//   examples: string[];
//   word: string;
// }

@Injectable()
export class FireStoreMigration {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async migrate() {
    const fileNameToAction: Record<string, (data: any) => void> = {
      'users.json': this.doMigrateForUsers,
    };
    const DATA_DIR = `${process.cwd()}/provo-firestore/data`;
    const fileNames = await readdir(DATA_DIR);

    await Promise.all(
      fileNames.map(async (fileName) => {
        const fileHandle = await open(`${DATA_DIR}/${fileName}`, 'r');
        const data = await fileHandle.readFile({ encoding: 'utf8' });
        if (!fileNameToAction[fileName]) {
          return Promise.resolve();
        }
        return fileNameToAction[fileName](JSON.parse(data));
      }),
    );
  }

  private async doMigrateForUsers(users: FirestoreUser[]) {
    const newUsers = users
      .map((user) => {
        if (!user.email) {
          return null;
        }
        const newInstance = new User();
        newInstance.email = user.email;
        newInstance.avatarSrc = user.photoURL;
        newInstance.name = user.displayName;
        return newInstance;
      })
      .filter(this.isNotNull);

    await this.userModel.insertMany(newUsers, {
      limit: 100,
    });
  }

  private isNotNull<T>(value: T | null): value is T {
    return value !== null;
  }
}
