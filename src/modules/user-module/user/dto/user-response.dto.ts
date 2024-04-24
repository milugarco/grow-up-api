import { ApiProperty } from '@nestjs/swagger';
import { Debt } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: 'John Doe',
    type: String,
    name: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'email@example.com',
    type: String,
    name: 'email',
  })
  email: string;

  @ApiProperty({
    example: '11:11:11',
    type: Date,
    name: 'createdAt',
  })
  createdAt: Date;

  @ApiProperty({
    example: '11:11:11',
    type: Date,
    name: 'updatedAt',
  })
  updatedAt: Date;

  @ApiProperty({})
  debts?: Debt[];
}
