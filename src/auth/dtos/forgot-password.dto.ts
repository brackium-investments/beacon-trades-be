import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * dto for forgot password
 */
export class ForgotPassswordDto {
  /**
   * email address
   */
  @ApiProperty({
    description: 'This is the email of the user',
    example: 'Favour@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
