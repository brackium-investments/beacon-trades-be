import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.schema';

/**
 * provider class for the change user password
 */
@Injectable()
export class ChangeUserPasswordProvider {
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
   * fuunction for changing the user password
   * @param user
   * @param newPassword
   * @returns user
   */
  public async changeUserPassword(userId: string, newPassword: string) {
    try {
      const updatedUser = await this.usersModel.findByIdAndUpdate(
        userId,
        {
          password: newPassword,
          resetOtp: null,
          resetOtpExpire: null,
        },
        { new: true }, // Returns the updated document
      );

      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw new RequestTimeoutException(error.message);
    }
  }
}
