import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Auth(AuthType.None)
  @Post('')
  public createSubscriber(@Body() payload: CreateSubscriberDto) {
    return this.subscribersService.createSubscriber(payload);
  }
}
