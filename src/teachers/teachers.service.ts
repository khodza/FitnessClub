import {
  Injectable,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { Teacher } from './teachers.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ImageService } from 'src/image.service';
import { Readable } from 'stream';

@Injectable()
export class TeachersService {
  private readonly log = new Logger(TeachersService.name);
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    @Inject('TeacherImageService') private readonly imageService: ImageService,
  ) {}

  async createTeacher(
    createTeacherDto: CreateTeacherDto,
    avatarFile?: Express.Multer.File,
  ): Promise<Teacher> {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        createTeacherDto.avatar = avatar;
      }
      const newTeacher = await this.teacherModel.create(createTeacherDto);
      this.log.log(`Created teacher with ID ${newTeacher.id}`);
      return newTeacher;
    } catch (err) {
      this.log.error(err);
      await this.imageService.deleteImage(createTeacherDto.avatar);
      throw new BadRequestException(err.message, err);
    }
  }

  async findAllTeachers(): Promise<Teacher[]> {
    try {
      const teachers = await this.teacherModel.find();
      this.log.log(`Getting all teachers`);
      return teachers;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async findTeacher(
    id: mongoose.Types.ObjectId,
    SelFields?: string,
    popFields?: string,
  ): Promise<Teacher> {
    try {
      const teacher = this.teacherModel.findById(id);
      if (SelFields) {
        teacher.select(SelFields);
      }
      if (popFields) {
        teacher.populate(popFields, '-author');
      }
      const readyTeacher = await teacher;
      if (!readyTeacher) {
        this.log.fatal(`No teacher with this ID : ${id}`);
        throw new BadRequestException(`No teacher with this ID : ${id}`);
      }
      this.log.log(`Getting teacher with ID ${id}`);
      return readyTeacher;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async findTeacherByEmail(
    email: string,
    selectField?: string,
  ): Promise<Teacher> {
    try {
      const teacher = await this.teacherModel
        .findOne({ email })
        .select(selectField);
      if (!teacher) {
        this.log.fatal(`No teacher with this email ${email}`);
        throw new BadRequestException(`No teacher with this email ${email}`);
      }
      this.log.log(`Getting teacher with email ${email}`);
      return teacher;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err);
    }
  }

  async getTeacherImage(filename: string): Promise<Readable> {
    // Get the image stream from the image service
    return this.imageService.getImageStream(filename);
  }

  async updateTeacher(
    id: mongoose.Types.ObjectId,
    updateOptions: UpdateTeacherDto,
    avatarFile?: Express.Multer.File,
  ) {
    try {
      if (avatarFile) {
        const avatar = await this.imageService.uploadImage(avatarFile);
        updateOptions.avatar = avatar;
      }
      const update = await this.teacherModel.updateOne(
        { _id: id },
        updateOptions,
        // { runValidators: true },
      );
      this.log.log(`Updated teacher with ID ${id}`);
      if (!update) {
        this.log.fatal(`No teacher with this ID : ${id}`);
        throw new BadRequestException(`No teacher with this id ${id}`);
      }
      const teacher = await this.findTeacher(id);
      return teacher;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  async removeTeacher(
    id: mongoose.Types.ObjectId,
  ): Promise<{ message: string }> {
    try {
      const deletedTeacher = await this.teacherModel.findById(id);
      if (!deletedTeacher) {
        this.log.fatal(`No teacher with this ID : ${id}`);
        throw new BadRequestException(`No teacher with this ID : ${id}`);
      }
      await this.teacherModel.deleteOne({ _id: id });
      this.log.log(`Deleted teacher with ID ${id}`);

      await this.imageService.deleteImage(deletedTeacher.avatar);
      return { message: `User with ID ${id} has been deleted` };
    } catch (err) {
      throw new BadRequestException(err.message, err);
    }
  }
}
