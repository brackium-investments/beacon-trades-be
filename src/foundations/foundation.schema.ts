import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class Foundation extends Document {
  @Prop({
    type: Number,
    required: [true, 'Please enter a valid amount'],
  })
  amount: number;

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
  })
  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  investor: ObjectId;
}

export const FoundationSchema = SchemaFactory.createForClass(Foundation);
