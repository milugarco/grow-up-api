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
}
