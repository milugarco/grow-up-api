import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DebtService } from './debt.service';
import { DebtResponse, DebtsResponse } from './dto/get-debt.dto';
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

  @Patch('v1/debt/:debtId')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Update a debt' })
  @ApiResponse({
    status: 200,
    type: DebtResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'debtId',
    type: Number,
  })
  @ApiQuery({
    name: 'description',
    type: String,
    required: false,
    example: 'electricity bill',
  })
  @ApiQuery({
    name: 'value',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'createdAt',
    type: Date,
    required: false,
    example: new Date(),
  })
  async update(
    @Req() req: any,
    @Param('debtId') debtId: number,
    @Query('description') description?: string,
    @Query('value') value?: number,
    @Query('createdAt') createdAt?: Date,
  ): Promise<DebtResponse> {
    const userId = req.auth.user.id;
    return this.debtService.update(
      userId,
      debtId,
      description,
      value,
      createdAt,
    );
  }

  @Get('v1/debt/:debtId')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Get a specific debt' })
  @ApiResponse({
    status: 200,
    type: DebtResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'debtId',
    type: Number,
  })
  async findOne(
    @Req() req: any,
    @Param('debtId') debtId: number,
  ): Promise<DebtResponse> {
    const userId = req.auth.user.id;
    return await this.debtService.findOne(userId, debtId);
  }

  @Get('v1/debt')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Get all debts' })
  @ApiResponse({
    status: 200,
    type: DebtsResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiQuery({
    name: 'initialDate',
    type: Date,
    example: '2024-04-24T01:07:34.667Z',
  })
  @ApiQuery({
    name: 'finalDate',
    type: Date,
    example: '2024-04-24T01:07:34.667Z',
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'perPage', type: Number, required: false, example: 10 })
  async findAll(
    @Req() req: any,
    @Query('initialDate') initialDate: Date,
    @Query('finalDate') finalDate: Date,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<DebtsResponse> {
    const userId = req.auth.user.id;
    return await this.debtService.findAll(
      userId,
      initialDate,
      finalDate,
      page,
      perPage,
    );
  }

  @Patch('v1/debt/:debtId/delete')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Delete a specific debt' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiParam({
    name: 'debtId',
    type: Number,
  })
  async delete(
    @Req() req: any,
    @Param('debtId') debtId: number,
  ): Promise<string> {
    const userId = req.auth.user.id;
    return await this.debtService.delete(userId, debtId);
  }
}
