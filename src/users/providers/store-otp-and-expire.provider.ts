import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';

/**
 * provider class for storing otp and expiry date
 */
@Injectable()
export class StoreOtpAndExpireProvider {
  /**
   * constructor
   * @param usersRepository
   */
  constructor(
    /**
     * Injecting the users repository
     */
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}

  /**
   * function for storing otp and expiry date
   * @param user
   * @param otp
   * @returns user
   */
  public async storeOtpAndExpire(user: User, otp: string) {
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

    try {
      const updatedUser = await this.usersModel
        .findByIdAndUpdate(
          user._id,
          { resetOtp: otp, resetOtpExpire: resetExpires },
          { new: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new RequestTimeoutException(error.message);
    }
  }
}
