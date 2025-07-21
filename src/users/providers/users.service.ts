import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UploadsService } from 'src/uploads/providers/uploads.service';
import { UpdatePasswordDto } from '../dtos/update-password.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { ContactUsDto } from '../dtos/contactUsDto';
import { MailService } from 'src/mail/providers/mail.service';

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

    private readonly uploadsService: UploadsService,

    private readonly bcryptProvider: HashingProvider,

    private readonly mailService: MailService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    files: Express.Multer.File[],
  ) {
    return await this.createUserProvider.createUser(createUserDto, files);
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

  public async updateUserProfile(
    payload: UpdateUserProfileDto,
    userId: string,
  ) {
    const user = await this.userModel.findByIdAndUpdate(userId, payload, {
      new: true,
    });

    return {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
    };
  }

  public async updateUserImage(file: Express.Multer.File, userId: string) {
    const imgUrl = await this.uploadsService.uploadFile(file, 'beacon');

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { image: imgUrl },
      {
        new: true,
      },
    );

    return {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber,
      image: imgUrl,
    };
  }

  public async updatePassword(payload: UpdatePasswordDto, userId: string) {
    const user = await this.userModel.findById(userId);

    if (
      user &&
      !(await this.bcryptProvider.comparePassword(
        payload.currentPassword,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Current password is wrong');
    }

    user.password = await this.bcryptProvider.hashPassword(payload.newPassword);

    await user.save();

    return user;
  }

  public async contactUs(payload: ContactUsDto) {
    await this.mailService.contactUsMail(
      payload.fullname,
      payload.email,
      payload.phoneNumber,
      payload.message,
    );
  }
}
