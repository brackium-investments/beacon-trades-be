// import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

/**
 * dto for the pagination query
 */
export class PaginationQueryDto {
  /**
   * limit for the number of items in the get all requests
   */
  @IsOptional()
  limit?: number = 0;

  /**
   * page number for the get all requests
   */
  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
