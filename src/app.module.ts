import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { InvestmentsModule } from './investments/investments.module';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PaginationModule } from './common/pagination/pagination.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { RolesGuard } from './auth/guards/roles/roles.guard';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('database.uri'),
          // auth: {
          //   username: configService.get('database.username'),
          //   password: configService.get('database.password'),
          // },
          dbName: configService.get('database.name'),
          retryWrites: true,
          w: 'majority',
          retryAttempts: 3,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        };
      },
    }),
    UsersModule,
    InvestmentsModule,
    AuthModule,
    // Importing an enviroment config specific for this module
    ConfigModule.forFeature(jwtConfig),
    // for asynchrousnously registering the jwt module and passing the config to the module
    JwtModule.registerAsync(jwtConfig.asProvider()),
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
