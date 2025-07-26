import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { InvestmentsService } from './providers/investments.service';
import { CreateInvestmentDto } from './dtos/create-investment.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { UpdateInvestmentDto } from './dtos/update-investment.dto';
import { GetInvestorInvestmentsDto } from './dtos/get-investments.dto';

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

  @Roles(Role.INVESTOR)
  @Get('')
  public getInvestments(@ActiveUser() user: ActiveUserData) {
    return this.investmentsService.getAllInvestments(user.sub);
  }

  @Get('investor-investments')
  public getInvestorInvestments(@Query() query: GetInvestorInvestmentsDto) {
    return this.investmentsService.getAllInvestments(query.id);
  }

  @Get('dashboard')
  public getInvestorDashboard(@ActiveUser() user: ActiveUserData) {
    return this.investmentsService.getInvestorDashboard(user.sub);
  }

  @Roles(Role.ADMIN)
  @Patch('activate-investment')
  public activateInvestment(@Body() payload: UpdateInvestmentDto) {
    return this.investmentsService.activateInvestment(payload.id);
  }
}
