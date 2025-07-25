import { Injectable } from '@nestjs/common';
import { CreateInvestmentProvider } from './create-investment.provider';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { GetInvestmentsProvider } from './get-investments.provider';
import { InjectModel } from '@nestjs/mongoose';
import { Investment } from '../investment.schema';
import { Model } from 'mongoose';
import { InvestmentState } from '../enums/investment-state.enum';
import { dateDiffInDays } from 'src/utils/dateCalcs';
import { InvestmentType } from '../enums/investment-type.enum';
import { MailService } from 'src/mail/providers/mail.service';
import { LoansService } from 'src/loans/providers/loans.service';
import { LoanState } from 'src/loans/enums/loan-state.enum';

@Injectable()
export class InvestmentsService {
  constructor(
    /**
     * injecting the create investment provider
     */
    private readonly createInvestmentProvider: CreateInvestmentProvider,

    private readonly getAllInvestmentsProvider: GetInvestmentsProvider,

    @InjectModel(Investment.name)
    private readonly investmentModel: Model<Investment>,

    private readonly mailService: MailService,

    private readonly loansService: LoansService,
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

  public async getAllInvestments(userId: string) {
    return await this.getAllInvestmentsProvider.getAllInvestments(userId);
  }

  public async getInvestorDashboard(userId: string) {
    const investments = await this.investmentModel.find({ investor: userId });

    const activeLoans = await this.loansService.getLoans(userId, {
      loanState: LoanState.ACTIVE,
    });

    const paidLoans = await this.loansService.getLoans(userId, {
      loanState: LoanState.PAID,
    });

    const totalDeposited = investments
      .filter((inv) => inv.investmentState !== InvestmentState.INACTIVE)
      .map((inv) => inv.amount)
      .reduce((acc, cur) => acc + cur, 0);

    const totalWithdrawn = investments
      .filter((inv) => inv.investmentState === InvestmentState.WITHDRAWN)
      .map((inv) => inv.amount)
      .reduce((acc, cur) => acc + cur, 0);

    const activeInvestmentsBalance = investments
      .filter((inv) => inv.investmentState === InvestmentState.ACTIVE)
      .map(
        (inv) =>
          Math.round((inv.amount * this.getInvRoi(inv)) / 100) + inv.amount,
      )
      .reduce((acc, cur) => acc + cur, 0);

    const filteredInvs = investments
      .filter((inv) => inv.investmentState === InvestmentState.ACTIVE)
      .map((inv) => ({
        investmentType: inv.investmentType,
        deposit: inv.amount,
        profit: Math.round((inv.amount * this.getInvRoi(inv)) / 100),
      }));

    const stockInvestments = filteredInvs.filter(
      (inv) => inv.investmentType === InvestmentType.STOCKS,
    );

    const cryptoInvestments = filteredInvs.filter(
      (inv) => inv.investmentType === InvestmentType.CRYPTO,
    );

    const mutualFundsInvestments = filteredInvs.filter(
      (inv) => inv.investmentType === InvestmentType.MUTUALFUNDS,
    );

    const graphData = [
      {
        investmentType: 'CRYPTO',
        deposit: cryptoInvestments
          .map((inv) => inv.deposit)
          .reduce((acc, cur) => acc + cur, 0),
        profit: cryptoInvestments
          .map((inv) => inv.profit)
          .reduce((acc, cur) => acc + cur, 0),
      },

      {
        investmentType: 'STOCK & ETFS',
        deposit: stockInvestments
          .map((inv) => inv.deposit)
          .reduce((acc, cur) => acc + cur, 0),
        profit: stockInvestments
          .map((inv) => inv.profit)
          .reduce((acc, cur) => acc + cur, 0),
      },
      {
        investmentType: 'MUTUAL FUNDS',
        deposit: mutualFundsInvestments
          .map((inv) => inv.deposit)
          .reduce((acc, cur) => acc + cur, 0),
        profit: mutualFundsInvestments
          .map((inv) => inv.profit)
          .reduce((acc, cur) => acc + cur, 0),
      },
    ];

    const totalBorrowed = activeLoans
      .map((loan) => loan.amount)
      .reduce((acc, cur) => acc + cur, 0);

    const totalPaid = paidLoans
      .map((loan) => loan.amount)
      .reduce((acc, cur) => acc + cur, 0);

    const loanGraphData = [
      {
        type: 'Total Borrowed',
        amount: totalBorrowed,
      },
      {
        type: 'Total Paided',
        amount: totalPaid,
      },
    ];

    return {
      totalDeposited,
      totalWithdrawn,
      totalBorrowed,
      availableBalance: activeInvestmentsBalance,
      graphData,
      loanGraphData,
    };
  }

  public async activateInvestment(id: string) {
    const updatedInvestment: any = await this.investmentModel
      .findByIdAndUpdate(
        id,
        {
          investmentState: InvestmentState.ACTIVE,
          activeDate: Date.now(),
        },
        { new: true },
      )
      .populate('investor', 'fullname email');

    await this.mailService.activateInvestmentMail(
      updatedInvestment.investor.fullname.split(' ')[0],
      updatedInvestment.investor.email,
      updatedInvestment.amount,
      updatedInvestment.investmentType,
    );

    return updatedInvestment;
  }

  private getInvRoi = (inv: any) => {
    const roi = inv.activeDate
      ? dateDiffInDays(
          new Date(inv.activeDate).getTime(),
          new Date().getTime(),
        ) * 0.16
      : 0;

    const investmentTime = dateDiffInDays(
      new Date(inv.dateCreated).getTime(),
      new Date(inv.nextPayout).getTime(),
    );

    // if the time has passed the next payout date then investment top amount is the static roi x the difference in active date and next payout

    if (
      dateDiffInDays(new Date(inv.nextPayout).getTime(), new Date().getTime()) >
      0
    ) {
      return investmentTime * 0.16;
    }

    // if the roi is greater than the choosen max drawdown for that particular inv then set the max drawdown as the roi
    if (roi >= inv.maximumDrawdown) {
      return inv.maximumDrawdown;
    }
    return roi.toFixed(2);
  };
}
