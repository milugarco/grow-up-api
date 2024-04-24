import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { genSaltSync, hash } from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: UserCreateDto): Promise<UserResponseDto> {
    try {
      const { email, name, password } = body;

      const userExists = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists) {
        throw new ConflictException('User already exists');
      }

      const saltRounds = 10;
      const salt = genSaltSync(saltRounds);
      const hashedPassword = await hash(password, salt);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          name: true,
          email: true,
          updatedAt: true,
          createdAt: true,
          debts: true,
        },
      });

      const response: UserResponseDto = {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        debts: user.debts,
      };

      return response;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user === null) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOne(userId: string): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const response: UserResponseDto = {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return response;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
