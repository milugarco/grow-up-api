import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class DebtUpdateDto {
  @ApiProperty({
    example: 'PUTAS',
    description: 'description of the debt',
    type: String,
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'AS PUTA TA CARO',
    type: Decimal,
    required: false,
  })
  value?: Decimal;
}
