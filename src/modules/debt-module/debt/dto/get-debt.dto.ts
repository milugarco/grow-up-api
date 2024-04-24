import { ApiProperty, PartialType } from '@nestjs/swagger';
import { DebtResponseDto } from './debt-response.dto';
import { PageInfo } from 'src/services/pagination.service';

export class DebtsResponse {
  @ApiProperty({
    type: () => [DebtResponseDto],
  })
  data: DebtResponseDto[];

  @ApiProperty({
    type: PageInfo,
    nullable: true,
  })
  pageInfo: PageInfo;
}

export class DebtResponse extends PartialType(DebtResponseDto) {}
