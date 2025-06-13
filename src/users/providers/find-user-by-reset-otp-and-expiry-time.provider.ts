import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';

/**
 * provider class for finding user based on stored reset token and expiry time
 */
@Injectable()
export class FindUserByResetOtpAndExpiryTimeProvider {
  /**
   * constructor
   * @param usersRepository
   */
  constructor(
    /**
     * injecting the users repository
     */
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}

  /**
   * function for finding a user based on the stored reset token and expiry time
   * @param otp
   * @returns user
   */
  public async findUserByResetOtpAndExpiryTime(otp: string) {
    let user;

    try {
      user = await this.usersModel
        .find({
          resetOtp: otp,
          resetOtpExpire: { $gt: new Date() }, // Use Mongoose `$gt` (greater than) operator
        })
        .exec();
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user[0]) {
      throw new UnauthorizedException('Otp is no longer valid');
    }

    return user[0];
  }
}
