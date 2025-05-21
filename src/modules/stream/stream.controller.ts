import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('stream')
export class StreamController {
  @Get('film_videos/:filename')
  async streamVideo(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'uploads',
      'film_videos',
      filename,
    );

    const videoExists = fs.existsSync(filePath);
    if (!videoExists) {
      throw new NotFoundException('Video fayli topilmadi');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = res.get('Range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      fileStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  }
}
