import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        APP_PORT: Joi.number().port().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().port().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().allow('').default(''),
        DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
        DATABASE_SSL: Joi.boolean().default(false),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRATION_SECONDS: Joi.number().integer().default(86400),
        SUPABASE_URL: Joi.string().uri().required(),
        SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
      }),
    }),
  ],
})
export class ConfigWrapperModule {}
