import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: [true, 'Please provide a full name'],
    lowercase: true,
  })
  fullName: string;

  @Prop({
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (val) =>
        /(?:\+?(\d{1,3}))?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/.test(val),
      message: 'Please provide a valid phone number',
    },
  })
  phoneNumber: string;

  @Prop({ type: String, required: [true, ['Please provide an address']] })
  address: string;

  @Prop({ type: String, required: false })
  referralId?: string;

  @Prop({ type: String, required: [true, 'Please provide a password'] })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.INVESTOR,
  })
  role: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  passwordChangedAt?: Date;

  @Prop({
    type: String,
    required: false,
  })
  passwordResetToken?: string;

  @Prop({
    type: Date,
    required: false,
  })
  passwordResetExpires?: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;

  @Prop({
    type: String,
    require: false,
  })
  image?: string;

  @Prop({
    type: [String],
    required: false,
  })
  referral?: string[];
}

// create a schema const and export from the class
export const UserSchema = SchemaFactory.createForClass(User);
