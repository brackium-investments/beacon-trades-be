import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Investment } from '../investment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class CreateInvestmentProvider {
  constructor(
    /**
     * injecting the investments model
     */
    @InjectModel(Investment.name)
    private readonly investmentsModel: Model<Investment>,

    /**
     * injecting the users service
     */
    private readonly usersService: UsersService,
  ) {}

  public async createInvestment(
    createInvestmentDto: CreateInvestmentDto,
    user: ActiveUserData,
  ) {
    const investor = await this.usersService.findUserById(user.sub);

    const newInvestment = new this.investmentsModel({
      ...createInvestmentDto,
      investor: investor.id,
    });

    try {
      return await newInvestment.save();
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
