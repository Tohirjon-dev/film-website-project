import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as path from 'path';

@Injectable()
export class MovieFilesService {
  constructor(private prisma: PrismaService) {}

  async uploadMovieFiles(movieId: number, files: Express.Multer.File[]) {
    const movie = await this.prisma.movies.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Bunday film topilmadi');
    }

    const existingFile = await this.prisma.movieFiles.findFirst({
      where: {
        movie_id: movieId,
      },
    });

    if (existingFile) {
      throw new BadRequestException('Filmga allaqachon video yuklangan');
    }

    const videoFile = files.find((f) => f.mimetype.startsWith('video/'));

    if (!videoFile) {
      throw new BadRequestException('Video fayl majburiy');
    }

    const filePath = `/uploads/film_videos/${movieId}-video.mp4`;

    return await this.prisma.$transaction(async (tx) => {
      await tx.movieFiles.create({
        data: {
          movie_id: movieId,
          file_url: filePath,
          quality: 'p720',
          language: 'uz',
        },
      });

      return { message: 'Fayl muvaffaqiyatli yuklandi' };
    });
  }

  async uploadMoviePoster(movieId: number, file: Express.Multer.File[]) {
    const movie = await this.prisma.movies.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException('Bunday film topilmadi');
    }

    if (movie.poster_url) {
      throw new BadRequestException('Filmga allaqachon poster yuklangan');
    }

    const posterFile = file[0];

    const posterPath = `/uploads/film_posters/${movieId}-poster.mp4`;

    await this.prisma.movies.update({
      where: { id: movieId },
      data: {
        poster_url: posterPath,
      },
    });
    return { message: 'Poster muvaffaqiyatli yuklandi' };
  }
}
