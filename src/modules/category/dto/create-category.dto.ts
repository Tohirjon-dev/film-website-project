import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  name: string;
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  slug: string;
  @IsString()
  description?: string;
}
