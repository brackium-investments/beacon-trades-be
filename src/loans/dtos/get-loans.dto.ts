import { IsNotEmpty, IsString } from 'class-validator';

export class GetInvestorLoansDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
