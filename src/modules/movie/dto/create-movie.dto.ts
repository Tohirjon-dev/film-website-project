import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @Length(3, 100)
  @IsNotEmpty()
  title: string;
  @IsString()
  @Length(3, 100)
  @IsNotEmpty()
  slug: string;
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;
  @IsInt()
  @IsNotEmpty()
  release_year: number;
  @IsInt()
  @IsNotEmpty()
  duration_minutes: number;
  @IsInt({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  categories: number[];
}
