import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { ForgotPassswordDto } from '../dtos/forgot-password.dto';
import { UsersService } from 'src/users/providers/users.service';
import { randomInt } from 'crypto';
import { HashingProvider } from './hashing.provider';
// import { MailService } from 'src/mail/providers/mail.service';
import * as crypto from 'crypto';

/**
 * provider for forgot password
 */
@Injectable()
export class ForgotPasswordProvider {
  /**
   * constructor
   * @param usersService
   * @param hashingProvider
   * @param mailService
   */
  constructor(
    /**
     * injecting the users service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * injecting the hashProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * injecting the mail service
     */
    // private readonly mailService: MailService,
  ) {}

  /**
   * function for sending otp email
   * @param forgotPasswordDto
   * @returns a message whether the email for otp was sent
   */
  public async forgotPassword(forgotPasswordDto: ForgotPassswordDto) {
    // get the email and check whether the user exists
    const user = await this.usersService.findOneByEmail(
      forgotPasswordDto.email,
    );

    // if user exist the generate the reset token
    // Generate a random integer between 1000 and 9999
    const resetOtp = randomInt(1000, 10000);

    const hashedOtp = crypto
      .createHash('sha256')
      .update(resetOtp.toString())
      .digest('hex');

    // store in the db
    await this.usersService.storeTokenOtpAndOtpExpire(user, hashedOtp);

    // send to the user email
    try {
      // await this.mailService.sendResetOtp(user, resetOtp.toString());
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(error);
    }
    return {
      message: 'Token sent to email successfully',
    };
  }
}
