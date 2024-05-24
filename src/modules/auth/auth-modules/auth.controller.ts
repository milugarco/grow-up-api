import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('v1/auth/')
  @ApiOperation({ summary: 'Get one auth' })
  @ApiResponse({
    description: 'The auth has been successfully get auth.',
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'password',
    required: true,
    type: String,
  })
  async login(
    @Query('email') email: string,
    @Query('password') password: string,
  ): Promise<string> {
    console.log(email);
    return await this.authService.login(email, password);
  }
}
