import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly log = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      this.log.verbose(new Error('Wrong password or email!'));
      throw new BadRequestException('Wrong password or email!');
    }
    this.log.log(`Approved user with ID ${user.id}`);
    return user;
  }
}
