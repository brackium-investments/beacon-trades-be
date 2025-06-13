import { Injectable } from '@nestjs/common';
import { CreateInvestmentProvider } from './create-investment.provider';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class InvestmentsService {
  constructor(
    /**
     * injecting the create investment provider
     */
    private readonly createInvestmentProvider: CreateInvestmentProvider,
  ) {}

  public async createInvestment(
    createInvestmentDto: CreateInvestmentDto,
    user: ActiveUserData,
  ) {
    return await this.createInvestmentProvider.createInvestment(
      createInvestmentDto,
      user,
    );
  }
}
