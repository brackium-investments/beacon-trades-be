import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { InvestmentType } from '../enums/investment-type.enum';
import { InvestmentState } from '../enums/investment-state.enum';
import { InvestmentPlan } from '../enums/investment-plan';

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(InvestmentType)
  investmentType: InvestmentType;

  @IsNotEmpty()
  @IsString()
  @IsEnum(InvestmentPlan)
  investmentPlan: InvestmentPlan;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsDate()
  activeDate?: Date;
}
