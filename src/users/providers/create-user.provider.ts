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
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // check if user already exists
    let existingUser;

    try {
      // check if user already exists with same email
      existingUser = await this.usersModel
        .findOne({ email: createUserDto.email })
        .exec();
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
      const newUser = new this.usersModel({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      try {
        return await newUser.save();
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
