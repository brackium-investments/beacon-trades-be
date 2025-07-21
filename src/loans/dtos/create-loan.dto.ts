import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateLoanDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  contractPeriod: Date;
}
