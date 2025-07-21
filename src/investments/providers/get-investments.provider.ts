import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Investment } from '../investment.schema';
import { Model } from 'mongoose';

@Injectable()
export class GetInvestmentsProvider {
  constructor(
    @InjectModel(Investment.name)
    private readonly investmentsModel: Model<Investment>,
  ) {}

  public async getAllInvestments(userId: string) {
    const investments = await this.investmentsModel.find({ investor: userId });

    return investments;
  }
}
