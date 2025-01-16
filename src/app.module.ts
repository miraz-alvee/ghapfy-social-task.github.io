import { UserEntity } from './user/entities/user.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { PostEntity } from './post/entities/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [UserEntity, PostEntity],
        synchronize: true,
        ssl: {
          //set this to true in production with proper certificates
          rejectUnauthorized: false, 
        },
      }),
      inject: [ConfigService],
    }), UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
