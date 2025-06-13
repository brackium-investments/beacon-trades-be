import { forwardRef, Module } from '@nestjs/common';
import { InvestmentsController } from './investments.controller';
import { InvestmentsService } from './providers/investments.service';
import { CreateInvestmentProvider } from './providers/create-investment.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Investment, InvestmentSchema } from './investment.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [InvestmentsController],
  providers: [InvestmentsService, CreateInvestmentProvider],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Investment.name,
        schema: InvestmentSchema,
      },
    ]),
  ],
})
export class InvestmentsModule {}
