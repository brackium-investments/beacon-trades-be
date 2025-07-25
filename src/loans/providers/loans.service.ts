import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan } from '../loan.schema';
import { CreateLoanDto } from '../dtos/create-loan.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UsersService } from 'src/users/providers/users.service';
import { MailService } from 'src/mail/providers/mail.service';
import { LoanState } from '../enums/loan-state.enum';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan.name)
    private readonly loanModel: Model<Loan>,

    private readonly usersService: UsersService,

    private readonly mailService: MailService,
  ) {}

  public async createLoan(payload: CreateLoanDto, user: ActiveUserData) {
    const investor = await this.usersService.findUserById(user.sub);

    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

    if (investor.createdAt > eightMonthsAgo) {
      throw new UnauthorizedException(
        'You need to have invested within the past 8 months',
      );
    }

    const newLoan = new this.loanModel({ ...payload, investor: investor.id });

    await this.mailService.applyForLoanMail(
      investor.fullname.split(' ')[0],
      investor.email,
      payload.amount,
    );

    try {
      return await newLoan.save();
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

  public async getLoans(userId: string, filter?: Record<string, string>) {
    const query: any = { investor: userId };

    if (filter?.loanState) {
      query.loanState = filter.loanState;
    }

    const loans = await this.loanModel.find(query);
    return loans;
  }

  public async activateLoan(id: string) {
    const updatedLoan: any = await this.loanModel
      .findByIdAndUpdate(
        id,
        {
          loanState: LoanState.ACTIVE,
          activeDate: Date.now(),
        },
        { new: true },
      )
      .populate('investor', 'fullname email');

    await this.mailService.activateLoanMail(
      updatedLoan.investor.fullname.split(' ')[0],
      updatedLoan.investor.email,
      updatedLoan.amount,
    );

    return updatedLoan;
  }
}
