import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { StoreOtpAndExpireProvider } from './providers/store-otp-and-expire.provider';
import { FindUserByResetOtpAndExpiryTimeProvider } from './providers/find-user-by-reset-otp-and-expiry-time.provider';
import { ChangeUserPasswordProvider } from './providers/change-user-password.provider';
import { FindOneByIdProvider } from './providers/find-one-by-id.provider';
import { AuthModule } from 'src/auth/auth.module';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UploadsModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    StoreOtpAndExpireProvider,
    FindUserByResetOtpAndExpiryTimeProvider,
    ChangeUserPasswordProvider,
    FindOneByIdProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
