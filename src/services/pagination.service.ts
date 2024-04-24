import { ApiProperty } from '@nestjs/swagger';

export class PageInfo {
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: 5 })
  remainingPages: number;
}

export function getPageInfo(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
): PageInfo {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const remainingPages = totalPages - currentPage;

  return {
    totalItems,
    totalPages,
    remainingPages,
  };
}
