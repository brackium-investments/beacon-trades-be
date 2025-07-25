import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { DonateToFoundationDto } from '../dtos/donate-to-foundation.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Foundation } from '../foundation.schema';
import { Model } from 'mongoose';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { MailService } from 'src/mail/providers/mail.service';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class FoundationsService {
  constructor(
    /**
     * injecting the investments model
     */
    @InjectModel(Foundation.name)
    private readonly foundationsModel: Model<Foundation>,

    private readonly mailService: MailService,

    private readonly usersService: UsersService,
  ) {}

  async donateToFoundation(
    payload: DonateToFoundationDto,
    user: ActiveUserData,
  ) {
    const investor = await this.usersService.findUserById(user.sub);

    const foundation = new this.foundationsModel({
      ...payload,
      investor: user.sub,
    });

    await this.mailService.sendFoundationRecievedMail(
      investor.fullname.split(' ')[0],
      investor.email,
      payload.amount,
    );

    try {
      return await foundation.save();
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

  async confirmDonation(id: string) {
    const updatedFoundation: any = await this.foundationsModel
      .findByIdAndUpdate(
        id,
        {
          isConfirmed: true,
        },
        { new: true },
      )
      .populate('investor', 'fullname email');

    await this.mailService.confirmDonationMail(
      updatedFoundation.investor.name.split(' ')[0],
      updatedFoundation.investor.email,
      updatedFoundation.amount,
    );

    return updatedFoundation;
  }
}
