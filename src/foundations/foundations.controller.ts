import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { DonateToFoundationDto } from './dtos/donate-to-foundation.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { FoundationsService } from './providers/foundations.service';
import { ConfirmDonationDto } from './dtos/confirm-donation.dto';
import { GetDonationsDto } from './dtos/get-donations.dto';

@Controller('foundations')
export class FoundationsController {
  constructor(
    /**
     * injecting the foundations service
     */
    private readonly foundationsService: FoundationsService,
  ) {}

  @Post('')
  donateToFoundation(
    @Body() payload: DonateToFoundationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.foundationsService.donateToFoundation(payload, user);
  }

  @Get('')
  getAllDonations(@Query() query: GetDonationsDto) {
    return this.foundationsService.getDonations(query.userId);
  }

  @Patch('confirm-donation')
  public confirmDonation(@Body() payload: ConfirmDonationDto) {
    return this.foundationsService.confirmDonation(payload.id);
  }
}
