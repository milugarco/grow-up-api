import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/modules/user-module/user/user.service';
import { PrismaService } from 'src/services/prisma.service';
import { DebtCreateDto } from './dto/debt-create.dto';
import { DebtResponse } from './dto/get-debt.dto';

@Injectable()
export class DebtService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, body: DebtCreateDto): Promise<DebtResponse> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }
      const { description, value } = body;

      let newDescription = null;

      if (!description) {
        newDescription = `Divida criada pelo user ${userExists.name}`;
      }

      const debt = await this.prisma.debt.create({
        data: {
          userId,
          description: description ? description : newDescription,
          value,
        },
        select: {
          userId: true,
          description: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response: DebtResponse = {
        userId: debt.userId,
        description: debt.description,
        value: debt.value,
        createdAt: debt.createdAt,
        updatedAt: debt.updatedAt,
      };

      return response;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ConflictException(error);
    }
  }
}
