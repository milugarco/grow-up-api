import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user-module/user/user.service';
import { DebtService } from './debt.service';
import { PrismaService } from 'src/services/prisma.service';
import { DebtController } from './debt.controller';

@Module({
  providers: [UserService, DebtService, PrismaService],
  controllers: [DebtController],
})
export class DebtModule {}
