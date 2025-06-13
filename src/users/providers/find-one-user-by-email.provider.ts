import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';

/**
 * provider for finding user based on email
 */
@Injectable()
export class FindOneUserByEmailProvider {
  /**
   * constructor
   * @param usersRepository
   */
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}

  /**
   * function for finding user based on email
   * @param email
   * @returns user
   */
  public async findOneByEmail(email: string) {
    let user: User | undefined = undefined;

    try {
      user = await this.usersModel
        .findOne({ email })
        .select('id password email role fullName')
        .exec();
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
