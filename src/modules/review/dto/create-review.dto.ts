import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
  @IsInt()
  @IsOptional()
  rating: number;
}
