import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InvestmentType } from './enums/investment-type.enum';
import { InvestmentState } from './enums/investment-state.enum';
import mongoose, { ObjectId } from 'mongoose';
import { Document } from 'mongoose';
import { InvestmentPlan } from './enums/investment-plan';

@Schema()
export class Investment extends Document {
  @Prop({
    type: String,
    enum: InvestmentType,
    required: [true, 'Please enter a valid investment type'],
  })
  investmentType: InvestmentType;

  @Prop({
    type: String,
    enum: InvestmentPlan,
    required: [true, 'Please enter a valid investment plan'],
  })
  investmentPlan: InvestmentPlan;

  @Prop({
    type: Number,
    required: [true, 'Please enter a valid amount'],
  })
  amount: number;

  @Prop({
    type: Date,
    required: false,
  })
  activeDate?: Date;

  @Prop({
    type: String,
    required: [true, 'Please enter a valid address'],
  })
  address: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  dateCreated: Date;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  updatedAt: Date;

  @Prop({
    type: Date,
    default: () => {
      const today = new Date();

      // Add 8 months to today's date
      const futureDate = new Date();
      futureDate.setMonth(today.getMonth() + 8);
      return futureDate;
    },
  })
  payoutDate: Date;

  @Prop({
    type: String,
    default: InvestmentState.INACTIVE,
  })
  investmentState: InvestmentState;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  investor: ObjectId;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
