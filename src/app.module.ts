import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironment } from '@libs/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@libs/database';
import { RedisModule } from '@libs/redis';
import { HashModule } from '@libs/hash';
import { UserModule } from '@classting/users';
import { AuthModule } from '@classting/auth';
import { SchoolPageModule } from '@classting/school-pages';
import { SchoolNewsModule } from '@classting/school-news';

const isProductionOrDevelopment = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';
const prodOrDevDependencies = isProductionOrDevelopment ? [RedisModule] : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    ...prodOrDevDependencies,
    HashModule,
    UserModule,
    AuthModule,
    SchoolPageModule,
    SchoolNewsModule,
  ],
})
export class AppModule {}
