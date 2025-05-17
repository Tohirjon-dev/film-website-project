import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  new_name: string;
  @IsOptional()
  @IsString()
  new_description?: string;
}
