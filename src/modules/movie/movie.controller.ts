import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RolesDeco } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { Request as ExpressRequest } from 'express';

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
  @UseGuards(AuthGuard)
  @Get(':id/watch')
  async watchMovie(
    @Param('id') movieId: number,
    @CurrentUser() user: userPayload,
    @Req() req: ExpressRequest,
  ) {
    return this.movieService.watchMovie(user.id, +movieId, req);
  }
  @Get(':id/download')
  async downloadMovie(@Param('id') movieId: number, @CurrentUser() user: userPayload) {
    return this.movieService.downloadMovie(user.id, movieId);
  }
}
