import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENV_KEYS } from '../common/constants';
import { createPostgresDataSourceOptions } from '../db/postgresql.options';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...createPostgresDataSourceOptions({
          host: configService.get<string>(ENV_KEYS.DATABASE_HOST)!,
          port: configService.get<number>(ENV_KEYS.DATABASE_PORT)!,
          username: configService.get<string>(ENV_KEYS.DATABASE_USERNAME)!,
          password: configService.get<string>(ENV_KEYS.DATABASE_PASSWORD)!,
          database: configService.get<string>(ENV_KEYS.DATABASE_NAME)!,
          synchronize: configService.get<boolean>(
            ENV_KEYS.DATABASE_SYNCHRONIZE,
          )!,
          ssl: configService.get<boolean>(ENV_KEYS.DATABASE_SSL)!,
        }),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class TypeOrmWrapperModule {}
