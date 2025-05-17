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
    if (!movie) throw new NotFoundException('Bunday film topilmadi');

    const videoFile = files.find((f) => f.mimetype.startsWith('video/'));
    const imageFile = files.find((f) => f.mimetype.startsWith('image/'));

    if (!videoFile) {
      throw new BadRequestException('Video fayl majburiy');
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.movieFiles.create({
        data: {
          movie_id: movieId,
          file_url: path.join('src', 'films', videoFile.filename),
          quality: 'p720',
          language: 'uz',
        },
      });
      if (imageFile) {
        await tx.movies.update({
          where: { id: movieId },
          data: {
            poster_url: path.join('src', 'films', imageFile.filename),
          },
        });
      }

      return { message: 'Fayllar muvaffaqiyatli yuklandi' };
    });
  }
}
