import { Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { UserModule } from './modules/user-module/user/user.module';
import { AuthModule } from './modules/auth/auth-modules/auth.module';
import { DebtModule } from './modules/debt-module/debt/debt.module';

@Module({
  imports: [AuthModule, UserModule, DebtModule],
  providers: [PrismaService],
})
export class AppModule {}
