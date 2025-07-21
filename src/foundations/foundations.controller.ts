import { Body, Controller, Post } from '@nestjs/common';
import { DonateToFoundationDto } from './dtos/donate-to-foundation.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { FoundationsService } from './providers/foundations.service';

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
}
