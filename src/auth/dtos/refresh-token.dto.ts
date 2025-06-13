import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * refresh token dto
 */
export class RefreshTokenDto {
  /**
   * refresh token
   */
  @ApiProperty({
    description: 'This is the refresh token',
    example: 'hdfbwojefbnqpkfbjoqfehfewfeqwf234jr',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
