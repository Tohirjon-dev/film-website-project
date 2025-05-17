import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { userPayload } from 'src/common/interfaces/request.user.interface';

@UseGuards(AuthGuard)
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Post('add')
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @CurrentUser() user: userPayload,
  ) {
    return await this.movieService.createMovie(createMovieDto, user);
  }

  @Get('all')
  async getAllFilms() {
    return await this.movieService.getAllFilms();
  }

  @Get('top')
  async getTopFilms() {
    return await this.movieService.getTopFilms();
  }

  @Get('search')
  async searchMovie(@Query('title') title: string) {
    return await this.movieService.searchFilm(title);
  }

  @UseGuards(RolesGuard)
  @RolesDeco('admin')
  @Delete('delete/:id')
  async removeFilm(@Param('id') id: string) {
    return await this.movieService.deleteFilmById(+id);
  }
}
