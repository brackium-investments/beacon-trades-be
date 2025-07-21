import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscriber extends Document {
  @Prop({
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  dateCreated: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
