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
import { UsersService } from './users.service';
import { ID } from './dto/id.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Create User [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  createUser(
    @UploadedFile() avatarFile: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.createUser(createUserDto, avatarFile);
  }

  //Get All Users(Clients) [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  //Get by email [admin]
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('email')
  getUserByEmail(@Query() query) {
    return this.usersService.findUserByEmail(query.email);
  }

  //Get Avatar of User
  // @UseGuards(JwtAuthGuard)
  @Get('images/:filename')
  async getUserImage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    // Fetch the image based on the filename and send it in the response
    const imageStream = await this.usersService.getUserImage(filename);

    // Set appropriate headers (e.g., content-type)
    res.setHeader('Content-Type', 'image/png');

    // Pipe the image stream to the response
    imageStream.pipe(res);
  }

  //Get User BY Id [admin]
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findUser(@Param() params: ID) {
    return this.usersService.findUser(params.id);
  }

  //UPDATE USER
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  updateUser(
    @Param() params: ID,
    @Body() updateOptions: UpdateUserDto,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    return this.usersService.updateUser(params.id, updateOptions, avatarFile);
  }

  //DELETE USER
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  removeUser(@Param() params: ID) {
    return this.usersService.removeUser(params.id);
  }
}
