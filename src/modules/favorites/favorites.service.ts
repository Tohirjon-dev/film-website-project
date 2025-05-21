import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { userPayload } from 'src/common/interfaces/request.user.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}
  async addToFavorites(movieId, user: userPayload) {
    const findMovie = await this.prisma.movies.findUnique({
      where: { id: movieId },
    });
    if (!findMovie)
      throw new BadRequestException('Bunday id li kino mavjud emas');
    const findFavorite = await this.prisma.favorites.findFirst({
      where: { user_id: user.id, movie_id: movieId },
    });
    if (findFavorite)
      throw new ConflictException(
        "Bu kino allaqachon sevimlilar bo'limingizda majvud",
      );
    await this.prisma.favorites.create({
      data: { user_id: user.id, movie_id: movieId },
    });
    return {
      message: "Kino sevimlilar ro'yxatiga qo'shildi",
      film_name: findMovie.title,
    };
  }
  async getMyFavouriteFilms(user: userPayload) {
    const favorites = await this.prisma.favorites.findMany({
      where: { user_id: user.id },
      include: { movie: true },
    });
    return favorites.map((favorite) => favorite.movie);
  }
  async deleteToFavorites(movieId, user: userPayload) {
    const findMovieMyFavorites = await this.prisma.favorites.findFirst({
      where: { movie_id: movieId, user_id: user.id },
    });
    if (!findMovieMyFavorites)
      throw new NotFoundException(
        'Bunday kino sevimlilar royxatingizda majvud emas',
      );
    await this.prisma.favorites.delete({
      where: { id: findMovieMyFavorites.id },
    });
    return {
      message: 'Kino sevimlilar royxatingizdan chiqarib yuborildi',
    };
  }
}
