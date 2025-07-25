import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDonationDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
