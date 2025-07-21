import { Module } from '@nestjs/common';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { Subscriber, SubscriberSchema } from './subscriber.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [SubscribersController],
  providers: [SubscribersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Subscriber.name,
        schema: SubscriberSchema,
      },
    ]),
  ],
})
export class SubscribersModule {}
