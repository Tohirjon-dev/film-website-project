import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieCategoryDto } from './create-movie-category.dto';

export class UpdateMovieCategoryDto extends PartialType(CreateMovieCategoryDto) {}
