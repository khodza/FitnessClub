import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeachersService } from './teachers.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { ID } from 'src/users/dto/id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  //Create Teacher [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  create(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() createTeacherDto: CreateTeacherDto,
  ) {
    return this.teachersService.createTeacher(createTeacherDto, avatarFile);
  }

  //Get All Teachers [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllTeachers() {
    return this.teachersService.findAllTeachers();
  }

  //Get Avatar of Teacher
  @UseGuards(JwtAuthGuard)
  @Get('images/:filename')
  async getUserImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    // Fetch the image based on the filename and send it in the response
    const imageStream = await this.teachersService.getTeacherImage(filename);

    // Set appropriate headers (e.g., content-type)
    res.setHeader('Content-Type', 'image/png');

    // Pipe the image stream to the response
    imageStream.pipe(res);
  }

  //Get by Teacher by email [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get('email')
  getTeacherByEmail(@Query() query) {
    return this.teachersService.findTeacherByEmail(query.email);
  }

  //Get Teacher by Id [admin,user]
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findTeacher(@Param() params: ID) {
    return this.teachersService.findTeacher(params.id);
  }

  //Update Client [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateTeacher(
    @Param() params: ID,
    @Body() updateOptions: UpdateTeacherDto,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.teachersService.updateTeacher(
      params.id,
      updateOptions,
      avatarFile,
    );
  }

  //DELETE USER [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  removeTeacher(@Param() params: ID) {
    return this.teachersService.removeTeacher(params.id);
  }
}
