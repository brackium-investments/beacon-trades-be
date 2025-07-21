import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoansService } from './providers/loans.service';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('')
  public createLoan(
    @Body() payload: CreateLoanDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.loansService.createLoan(payload, user);
  }

  @Roles(Role.INVESTOR)
  @Get('')
  public getInvestments(@ActiveUser() user: ActiveUserData) {
    return this.loansService.getLoans(user.sub);
  }
}
