import { IsNotEmpty, IsString } from 'class-validator';

export class GetInvestorInvestmentsDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
