import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from './subscriber.schema';
import { Model } from 'mongoose';
import { CreateSubscriberDto } from './dtos/create-subscriber.dto';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<Subscriber>,

    private readonly mailService: MailService,
  ) {}

  public async createSubscriber(payload: CreateSubscriberDto) {
    // check if user already exists
    let existingSubscriber;

    try {
      // check if user already exists with same email
      existingSubscriber = await this.subscriberModel
        .findOne({ email: payload.email })
        .exec();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // handle exception
    if (existingSubscriber) {
      throw new BadRequestException(
        'The subscriber already exists, please check your email',
        {},
      );
    } else {
      const newSubscriber = new this.subscriberModel({
        ...payload,
      });

      await this.mailService.subscriberMail(payload.email);

      try {
        return await newSubscriber.save();
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
  }
}
