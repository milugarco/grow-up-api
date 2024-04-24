import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    name: 'name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: '123',
    type: String,
    name: 'password',
    required: false,
  })
  password?: string;
}
