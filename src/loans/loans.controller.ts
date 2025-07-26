import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { LoansService } from './providers/loans.service';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ActivateLoanDto } from './dtos/activate-loan.dto';
import { GetInvestorLoansDto } from './dtos/get-loans.dto';

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
  public getLoans(@ActiveUser() user: ActiveUserData) {
    return this.loansService.getLoans(user.sub);
  }

  @Roles(Role.ADMIN)
  @Get('investor-loans')
  public getInvestorLoans(@Query() query: GetInvestorLoansDto) {
    return this.loansService.getLoans(query.id);
  }

  @Roles(Role.ADMIN)
  @Patch('activate-loan')
  public activateInvestment(@Body() payload: ActivateLoanDto) {
    return this.loansService.activateLoan(payload.id);
  }
}
