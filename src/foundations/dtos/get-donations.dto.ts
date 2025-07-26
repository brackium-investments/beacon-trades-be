import { IsNotEmpty, IsString } from 'class-validator';

export class GetDonationsDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
