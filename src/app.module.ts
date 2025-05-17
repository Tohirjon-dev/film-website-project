import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import AllConfig from './common/config';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UserModule } from './modules/user/user.module';
import { SubscriptionPlansModule } from './modules/subscription-plans/subscription-plans.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CategoryModule } from './modules/category/category.module';
import { MovieModule } from './modules/movie/movie.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { ReviewModule } from './modules/review/review.module';
import { WatchHistoryModule } from './modules/watch-history/watch-history.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { UserSubscriptionModule } from './modules/user-subscription/user-subscription.module';
import { MovieFilesModule } from './modules/movie-files/movie-files.module';
import { MovieCategoriesModule } from './modules/movie-categories/movie-categories.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
@Module({
  imports: [
    PrismaModule,
    UserModule,
    SubscriptionPlansModule,
    PaymentsModule,
    CategoryModule,
    MovieModule,
    SuperAdminModule,
    ReviewModule,
    WatchHistoryModule,
    FavoritesModule,
    UserSubscriptionModule,
    MovieFilesModule,
    MovieCategoriesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: AllConfig,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return config.get('JWT-CONFIG') as JwtModuleOptions;
      },
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './src/films',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
