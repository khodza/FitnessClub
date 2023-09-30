import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { ImageService } from 'src/image.service';
import { Readable } from 'stream';

@Injectable()
export class UsersService {
  private readonly log = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject('UserImageService') private readonly imageService: ImageService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        createUserDto.avatar = avatar;
      }
      const newUser = await this.userModel.create(createUserDto);
      this.log.log(`Created user with ID ${newUser.id}`);
      return newUser;
    } catch (err) {
      this.log.error(err);
      if (avatarFile) {
        await this.imageService.deleteImage(createUserDto.avatar);
      }
      throw new BadRequestException(err.message, err);
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.find({ roles: ['user'] });
      this.log.log(`Getting all users(clients)`);
      return users;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async findUser(
    id: mongoose.Types.ObjectId,
    SelFields?: string,
    popFields?: string,
  ): Promise<User> {
    try {
      const user = this.userModel.findById(id);
      if (SelFields) {
        user.select(SelFields);
      }
      if (popFields) {
        user.populate(popFields, '-author');
      }
      const readyUser = await user;
      if (!readyUser) {
        this.log.fatal(`No user with this ID : ${id}`);
        throw new BadRequestException(`No user with this ID : ${id}`);
      }
      this.log.log(`Getting user with ID ${id}`);
      return readyUser;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async findUserByEmail(email: string, selectField?: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).select(selectField);
      if (!user) {
        this.log.fatal(`No user with this email ${email}`);
        throw new BadRequestException(`No user with this email ${email}`);
      }
      this.log.log(`Getting user with email ${email}`);
      return user;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async getUserImage(filename: string): Promise<Readable> {
    // Get the image stream from the image service
    return this.imageService.getImageStream(filename);
  }

  async updateUser(
    id: mongoose.Types.ObjectId,
    updateOptions: UpdateUserDto,
    avatarFile?: Express.Multer.File,
  ): Promise<User> {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        updateOptions.avatar = avatar;
      }
      const update = await this.userModel.updateOne(
        { _id: id },
        updateOptions,
        { runValidators: true },
      );
      if (!update) {
        throw new BadRequestException(`No user with this id ${id}`);
      }
      const user = await this.findUser(id);
      return user;
    } catch (err) {
      this.log.error(err);
      if (avatarFile) {
        await this.imageService.deleteImage(updateOptions.avatar);
      }
      throw new BadRequestException(err.message, err);
    }
  }

  async removeUser(id: mongoose.Types.ObjectId): Promise<{ message: string }> {
    try {
      const deletedUser = await this.userModel.findById(id);
      if (!deletedUser) {
        throw new BadRequestException(`No user with this ID : ${id}`);
      }
      await this.userModel.deleteOne({ _id: id });
      this.log.log(`Deleted user with ID ${id}`);
      // Delete the image from the image service
      await this.imageService.deleteImage(deletedUser.avatar);
      return { message: `User with ID ${id} has been deleted` };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }
}
