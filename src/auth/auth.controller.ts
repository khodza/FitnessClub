import {
  Controller,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly log = new Logger(AuthController.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  //Create Admin
  @Post('addAdmin')
  async signup() {
    const admin = {
      email: 'admin@gmail.com',
      password: '2003qwerty',
      confirmPassword: '2003qwerty',
      first_name: 'Admin',
      last_name: 'Admin',
      birth_date: new Date('2003-01-01'),
      avatar:
        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
      service_price: '0',
      phone_number: 977777777,
      teacher_id: null,
      created_at: new Date(),
      updated_at: new Date(),
      roles: ['user', 'admin'],
    };
    try {
      const user = await this.usersService.createUser(admin);
      const token = await this.authService.login(user);

      return { token, user };
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }

  // LOGIN;
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      const token = await this.authService.login(req.user);
      const user = await this.usersService.findUserByEmail(req.user.email);
      return { token, user };
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }
}
