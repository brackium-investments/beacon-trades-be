import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user.schema';
import { Model } from 'mongoose';

/**
 * provider class for finding one user by id
 */
@Injectable()
export class FindOneByIdProvider {
  /**
   * constructor
   * @param usersRepository
   */
  constructor(
    /**
     * injecting user repository
     */
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,
  ) {}

  /**
   * function for finding user based on id
   * @param id
   * @returns user
   */
  public async findById(id: string) {
    let user;
    try {
      user = await this.usersModel.findById(id).exec();
    } catch (err: any) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * Handle the user does not exist
     */
    if (!user) {
      throw new BadRequestException('The user does not exist');
    }
    return user;
  }
}
