import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
