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

export class CreateInvestmentDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(InvestmentType)
  investmentPlanType: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsOptional()
  @IsDate()
  activeDate?: Date;

  @IsOptional()
  @IsInt()
  @IsEnum(InvestmentState)
  investmentState?: string;
}
