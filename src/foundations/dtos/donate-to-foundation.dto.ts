import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DonateToFoundationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  @IsNotEmpty()
  amount: number;
}
