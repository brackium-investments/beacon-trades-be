import { Module } from '@nestjs/common';
import { FoundationsController } from './foundations.controller';
import { FoundationsService } from './providers/foundations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Foundation, FoundationSchema } from './foundation.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [FoundationsController],
  providers: [FoundationsService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Foundation.name,
        schema: FoundationSchema,
      },
    ]),
  ],
})
export class FoundationsModule {}
