import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user-module/user/user.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('app.jwtSecret');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = compareSync(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials provided');
    }

    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);

    delete user.password;

    const payload = { user: user };

    const accessToken = this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
    });

    return accessToken;
  }
}
