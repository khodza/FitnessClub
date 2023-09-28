import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { UsersService } from '../users/users.service';
import * as bycypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly log = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(
      email,
      'password email roles',
    );
    if (user && (await bycypt.compare(password, user.password))) {
      this.log.log(`Validation approved of user ${email} on logging`);
      return user;
    }
    this.log.fatal(`Validation failed of user ${email} on logging`);

    return null;
  }

  async login(user: User): Promise<string> {
    try {
      const payload = { userId: user._id, roles: user.roles };
      const token = await this.jwtService.signAsync(payload);
      this.log.log(`Created token of user with ID ${user.id}`);
      return token;
    } catch (err) {
      this.log.error(err);
      throw new BadRequestException(err.message, err);
    }
  }
}
