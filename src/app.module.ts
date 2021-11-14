import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import * as Joi from 'joi';
import {AuthenticationModule} from './authentication/authentication.module';
import {DatabaseModule} from './database/database.module';
import { PostsModule } from './posts/posts.module';
import {ExceptionsLoggerFilter} from './utils/exceptions-logger.filter';
import {ExcludeNullInterceptor} from './utils/exclude-null.interceptor';
import {CategoriesModule} from './categories/categories.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                PORT: Joi.number(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION_TIME: Joi.string().required()
            }),
        }),
        DatabaseModule,
        PostsModule,
        AuthenticationModule,
        CategoriesModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionsLoggerFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ExcludeNullInterceptor
        }
    ],
})
export class AppModule {}
