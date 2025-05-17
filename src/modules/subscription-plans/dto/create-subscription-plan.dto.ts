import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;
  @IsDecimal()
  @IsNotEmpty()
  price: string;
  @IsInt()
  @IsNotEmpty()
  duration_days: number;
  @IsOptional()
  @IsString()
  features?: string;
}
