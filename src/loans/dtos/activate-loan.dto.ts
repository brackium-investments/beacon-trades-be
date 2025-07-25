import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateLoanDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
