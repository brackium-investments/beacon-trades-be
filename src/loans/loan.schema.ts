import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { LoanState } from './enums/loan-state.enum';
import { Document } from 'mongoose';

@Schema()
export class Loan extends Document {
  @Prop({
    type: Number,
    required: [true, 'Please enter a valid amount'],
  })
  amount: number;

  @Prop({
    type: String,
    default: LoanState.INACTIVE,
  })
  loanState: LoanState;

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
  })
  contractPeriod: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  investor: ObjectId;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);
