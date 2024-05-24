import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user-module/user/user.service';
import { PrismaService } from 'src/services/prisma.service';
import { DebtCreateDto } from './dto/debt-create.dto';
import { DebtResponse, DebtsResponse } from './dto/get-debt.dto';
import { Prisma } from '@prisma/client';
import { getPageInfo } from 'src/services/pagination.service';

@Injectable()
export class DebtService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) { }

  async create(userId: string, body: DebtCreateDto): Promise<DebtResponse> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      const { description, value, createdAt } = body;

      let newDescription = null;

      if (!description) {
        newDescription = `Divida criada pelo user ${userExists.name}`;
      }

      const debt = await this.prisma.debt.create({
        data: {
          userId,
          description: description ? description : newDescription,
          value,
          createdAt: createdAt ? createdAt : new Date(),
        },
        select: {
          users: {
            select: {
              name: true,
            },
          },
          description: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response: DebtResponse = {
        userName: debt.users.name,
        description: debt.description,
        value: debt.value,
        createdAt: debt.createdAt.toISOString(),
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

  async update(
    userId: string,
    debtId: number,
    description?: string,
    value?: number,
    createdAt?: Date,
  ): Promise<DebtResponse> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      const debtExists = await this.findOne(userId, debtId);

      if (!debtExists) {
        throw new NotFoundException(`Debt not found`);
      }

      const debtUpdated = await this.prisma.debt.update({
        where: {
          id: Number(debtId),
        },
        data: {
          description: description ? description : debtExists.description,
          createdAt: createdAt ? createdAt : debtExists.createdAt,
          value: value ? Number(value) : debtExists.value,
        },
        select: {
          users: {
            select: {
              name: true,
            },
          },
          description: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response: DebtResponse = {
        userName: debtUpdated.users.name,
        createdAt: debtUpdated.createdAt.toISOString(),
        description: debtUpdated.description,
        updatedAt: debtUpdated.updatedAt,
        value: debtUpdated.value,
      };

      return response;
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new ConflictException(error);
    }
  }

  async findOne(userId: string, debtId: number): Promise<DebtResponse> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      const debtExists = await this.prisma.debt.findUnique({
        where: {
          id: Number(debtId),
          deleteAt: null,
        },
        select: {
          users: {
            select: {
              name: true,
            },
          },
          description: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const response: DebtResponse = {
        userName: debtExists.users.name,
        createdAt: debtExists.createdAt.toISOString(),
        description: debtExists.description,
        updatedAt: debtExists.updatedAt,
        value: debtExists.value,
      };

      return response;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAll(
    userId: string,
    initialDate: Date,
    finalDate: Date,
    page: number = 1,
    perPage: number = 10,
  ): Promise<DebtsResponse> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      const where: Prisma.DebtWhereInput = {
        createdAt: {
          gte: initialDate,
          lte: finalDate,
        },
        deleteAt: null,
      };

      const debts = await this.prisma.debt.findMany({
        where,
        take: Number(perPage),
        skip: (page - 1) * perPage,
        select: {
          id: true,
          users: { select: { name: true } },
          description: true,
          value: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const totalCount = await this.prisma.debt.count({
        where,
      });

      const pageInfo = getPageInfo(totalCount, page, perPage);

      const response: DebtsResponse = {
        data: debts.map((debt) => {
          return {
            id: debt.id,
            userName: debt.users.name,
            description: debt.description,
            value: debt.value,
            createdAt: debt.createdAt.toISOString(),
            updatedAt: debt.updatedAt,
          };
        }),
        pageInfo: pageInfo,
      };

      return response;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error);
    }
  }

  async delete(userId: string, debtId: number): Promise<string> {
    try {
      const userExists = await this.userService.findOne(userId);

      if (!userExists) {
        throw new BadRequestException('User not found');
      }

      const debtExists = await this.findOne(userId, debtId);

      if (!debtExists) {
        throw new NotFoundException(`Debt not found`);
      }

      await this.prisma.debt.update({
        where: { id: Number(debtId) },
        data: {
          deleteAt: new Date(),
        },
      });

      return 'Debt has been deleted';
    } catch (error) {
      throw new Error(error);
    }
  }

  async reportDebts(userId: string, year: number) {
    try {
      const initialDate: Date = new Date(`${year}-01-01T00:00:00Z`);
      console.log(initialDate);
      const finalDate: Date = new Date(`${year}-12-31T23:59:59Z`);
      console.log(finalDate);
      const debts = await this.prisma.debt.findMany({
        where: {
          createdAt: {
            gte: initialDate,
            lte: finalDate,
          },
        },
        select: {
          createdAt: true,
          id: true,
          description: true,
          value: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      function getMonth(dateString: Date) {
        return dateString.toString().split(' ')[1]; // Retorna o segundo elemento do array, que é o mês
      }

      const groupedDebts = debts.reduce((acc, debt) => {
        const month = getMonth(debt.createdAt);
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(debt);
        return acc;
      }, {});

      const formattedResult = Object.entries(groupedDebts).map(
        ([month, debtsArray]) => ({
          month: month.padStart(2, '0'),
          debts: debtsArray,
        }),
      );

      return formattedResult;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error);
    }
  }
}
