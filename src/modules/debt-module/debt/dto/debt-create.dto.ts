import { ApiProperty } from '@nestjs/swagger';

export class DebtCreateDto {
  @ApiProperty({
    example: 'PUTAS',
    description: 'description of the debt',
    type: String,
  })
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'AS PUTA TA CARO',
    type: Number,
  })
  value: number;

  @ApiProperty({
    example: '2024-04-16T01:26:24.801Z',
    description: 'Date created debt',
    type: Date,
    required: false,
  })
  createdAt?: Date;
}
