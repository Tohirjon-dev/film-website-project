import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { userPayload } from 'src/common/interfaces/request.user.interface';

@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Post('add/:id')
  async addToFavorites(
    @Param('id') id: string,
    @CurrentUser() user: userPayload,
  ) {
    return await this.favoritesService.addToFavorites(+id, user);
  }
  @Get()
  async getMyFavouriteFilms(@CurrentUser() user: userPayload) {
    return await this.favoritesService.getMyFavouriteFilms(user);
  }
  @Delete(':id')
  async deleteToMyFavorites(
    @Param('id') id: string,
    @CurrentUser() user: userPayload,
  ) {
    return await this.favoritesService.deleteToFavorites(+id, user);
  }
}
