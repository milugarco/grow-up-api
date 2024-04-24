import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';
import { AuthUserGuard } from 'src/modules/auth/auth-modules/auth-user.guards';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('v1/user')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiBody({
    type: UserCreateDto,
  })
  async create(@Body() body: UserCreateDto): Promise<UserResponseDto> {
    return await this.userService.create(body);
  }

  @Get('v1/user/')
  @ApiBearerAuth()
  @UseGuards(AuthUserGuard)
  @ApiOperation({ summary: 'Find a user' })
  @ApiResponse({
    description: 'The record has been find.',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input parameters',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOne(@Request() req: any): Promise<UserResponseDto> {
    const userId = req.auth.user.id;
    return await this.userService.findOne(userId);
  }
}
