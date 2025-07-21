import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Loan } from '../loan.schema';
import { CreateLoanDto } from '../dtos/create-loan.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { UsersService } from 'src/users/providers/users.service';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectModel(Loan.name)
    private readonly loanModel: Model<Loan>,

    private readonly usersService: UsersService,

    private readonly mailService: MailService,
  ) {}

  public async createLoan(payload: CreateLoanDto, user: ActiveUserData) {
    console.log(payload);
    const investor = await this.usersService.findUserById(user.sub);

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

  public async getLoans(userId: string) {
    const investments = await this.loanModel.find({ investor: userId });

    return investments;
  }
}
