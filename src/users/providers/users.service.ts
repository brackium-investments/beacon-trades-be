import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { ChangeUserPasswordProvider } from './change-user-password.provider';
import { FindOneByIdProvider } from './find-one-by-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { StoreOtpAndExpireProvider } from './store-otp-and-expire.provider';
import { FindUserByResetOtpAndExpiryTimeProvider } from './find-user-by-reset-otp-and-expiry-time.provider';

@Injectable()
export class UsersService {
  constructor(
    /**
     * injecting user model
     */
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    /**
     * injecting the create user provider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * injecting the change user password provider
     */
    private readonly changeUserPasswordProvider: ChangeUserPasswordProvider,

    /**
     * injecting the find user by id provider
     */
    private readonly findUserByIdProvider: FindOneByIdProvider,

    /**
     * injecting the find one user by email provider
     */
    private readonly findOneByEmailProvider: FindOneUserByEmailProvider,

    /**
     * injecting the store otp and reset time provider
     */
    private readonly storeTokenOtpAndOtpExpireProvider: StoreOtpAndExpireProvider,

    /**
     * injecting the find user by reset otp and expires provider
     */
    private readonly findUserByResetOtpAndExpiresProvider: FindUserByResetOtpAndExpiryTimeProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async changeUserPassword(userId: string, newPassword: string) {
    return await this.changeUserPasswordProvider.changeUserPassword(
      userId,
      newPassword,
    );
  }

  public async findUserById(userId: string) {
    return await this.findUserByIdProvider.findById(userId);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  public async storeTokenOtpAndOtpExpire(user: User, otp: string) {
    return await this.storeTokenOtpAndOtpExpireProvider.storeOtpAndExpire(
      user,
      otp,
    );
  }

  /**
   * function for getting the user based on the stored reset token and expiry date
   * @param otp
   * @returns the user based on the stored reset token and expiry date
   */
  public async findUserByResetOtpAndExpiryTime(otp: string) {
    return await this.findUserByResetOtpAndExpiresProvider.findUserByResetOtpAndExpiryTime(
      otp,
    );
  }
}
