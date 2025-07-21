import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UploadsService } from 'src/uploads/providers/uploads.service';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
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

    /**
     * injecting the hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * injecting uploads service
     */
    private readonly uploadsService: UploadsService,

    private readonly mailService: MailService,
  ) {}

  public async createUser(
    createUserDto: CreateUserDto,
    files: Express.Multer.File[],
  ) {
    // check if user already exists
    let existingUser;

    try {
      // check if user already exists with same email
      existingUser = await this.usersModel
        .findOne({ email: createUserDto.email })
        .exec();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
        {},
      );
    } else {
      const uploadedFilesUrl = await Promise.all(
        files.map(
          async (file) => await this.uploadsService.uploadFile(file, 'beacon'),
        ),
      );

      const newUser = new this.usersModel({
        ...createUserDto,
        stateIssuedIDUrl: uploadedFilesUrl[0] || '',
        driversLicenseUrl: uploadedFilesUrl[1] || '',
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      await this.mailService.welcomeMail(
        newUser.fullname.split(' ')[0],
        newUser.email,
      );

      try {
        return await newUser.save();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new RequestTimeoutException(
          'Unable to process your request at the moment, please try later',
          {
            description: 'Error connecting to the database',
          },
        );
      }
    }
  }
}
