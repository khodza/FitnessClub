import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeachersController } from './teacher.controller';
import { TeachersService } from './teachers.service';
import { TeacherSchema } from './teachers.schema';
import { ImageService } from 'src/services/image.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teacher', schema: TeacherSchema }]),
  ],
  controllers: [TeachersController],
  providers: [
    TeachersService,
    {
      provide: 'TeacherImageService',
      useFactory: () => {
        return new ImageService('teachers');
      },
    },
  ],
})
export class TeachersModule {}
