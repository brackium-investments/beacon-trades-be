import { Body, Controller, Post } from '@nestjs/common';
import { InvestmentsService } from './providers/investments.service';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('investments')
export class InvestmentsController {
  constructor(
    /**
     * injecting the investments service
     */
    private readonly investmentsService: InvestmentsService,
  ) {}

  @Post('')
  public createInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.investmentsService.createInvestment(createInvestmentDto, user);
  }
}
