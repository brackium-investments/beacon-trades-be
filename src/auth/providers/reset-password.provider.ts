import { Injectable } from '@nestjs/common';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { HashingProvider } from './hashing.provider';
import { UsersService } from 'src/users/providers/users.service';
import * as crypto from 'crypto';

/**
 * provider for reset password
 */
@Injectable()
export class ResetPasswordProvider {
  /**
   * constructor
   * @param hashingProvider
   * @param usersService
   */
  constructor(
    /**
     * injecting the hashProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * injecting users service
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * function for resetting password
   * @param resetPasswordDto
   * @returns message with regards to whether the password has been reset successfully
   */
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // get the otp and hash it
    const hashedOtp = crypto
      .createHash('sha256')
      .update(resetPasswordDto.otp.toString())
      .digest('hex');

    // find the user based on the hased otp and timestamp
    const user =
      await this.usersService.findUserByResetOtpAndExpiryTime(hashedOtp);

    const hashedPassword = await this.hashingProvider.hashPassword(
      resetPasswordDto.password,
    );

    // if user exists then change the password and clear the reset token and timestamp
    await this.usersService.changeUserPassword(user, hashedPassword);

    return {
      message: 'Password changed successfully',
    };
  }
}
