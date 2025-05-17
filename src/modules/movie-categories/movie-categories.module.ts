import { Module } from '@nestjs/common';
import { MovieCategoriesService } from './movie-categories.service';
import { MovieCategoriesController } from './movie-categories.controller';

@Module({
  controllers: [MovieCategoriesController],
  providers: [MovieCategoriesService],
})
export class MovieCategoriesModule {}
