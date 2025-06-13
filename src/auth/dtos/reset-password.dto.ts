import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
 * reset password dto
 */
export class ResetPasswordDto {
  /**
   * otp for reset password
   */
  @ApiProperty({
    description: 'This is the reset otp',
    example: 2343,
  })
  @IsInt()
  @IsNotEmpty()
  otp: number;

  /**
   * new password
   */
  @ApiProperty({
    description: 'This is the new password of the user',
    example: '@Favour233',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
