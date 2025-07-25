import { forwardRef, Module } from '@nestjs/common';
import { LoansController } from './loans.controller';
import { LoansService } from './providers/loans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './loan.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [LoansController],
  providers: [LoansService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Loan.name,
        schema: LoanSchema,
      },
    ]),
  ],
  exports: [LoansService],
})
export class LoansModule {}
