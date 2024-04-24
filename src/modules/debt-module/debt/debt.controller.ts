import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DebtService } from './debt.service';
import { DebtResponse } from './dto/get-debt.dto';
import { DebtCreateDto } from './dto/debt-create.dto';
import { AuthUserGuard } from 'src/modules/auth/auth-modules/auth-user.guards';

@ApiTags('Debt')
@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('v1/debt')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Create a new debt' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: DebtResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBody({
    type: DebtCreateDto,
  })
  async create(
    @Body() body: DebtCreateDto,
    @Req() req: any,
  ): Promise<DebtResponse> {
    const userId = req.auth.user.id;
    return await this.debtService.create(userId, body);
  }
}
