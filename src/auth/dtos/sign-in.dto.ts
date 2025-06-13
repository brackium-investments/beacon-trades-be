import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * sign in dto
 */
export class SignInDto {
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

  /**
   * password
   */
  @ApiProperty({
    description: 'This is the password of the user',
    example: '@Favour233',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
