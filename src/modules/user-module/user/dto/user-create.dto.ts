import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    name: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'example@example.com',
    type: String,
    name: 'email',
  })
  email: string;

  @ApiProperty({
    example: '123',
    type: String,
    name: 'password',
  })
  password: string;
}
