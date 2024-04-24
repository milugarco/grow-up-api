import { ApiProperty } from '@nestjs/swagger';

export class DebtResponseDto {
  @ApiProperty({
    example: 'USER ID',
    description: 'User debt',
    type: String,
  })
  userId: string;

  @ApiProperty({
    example: 'PUTAS',
    description: 'description of the debt',
    type: String,
  })
  description: string;

  @ApiProperty({
    example: 10,
    description: 'AS PUTA TA CARO',
    type: Number,
  })
  value: number;

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
}
