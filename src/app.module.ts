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

const isProduction = process.env.NODE_ENV === 'production';
const productionDependencies = isProduction ? [RedisModule] : [];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
    }),
    ...productionDependencies,
    HashModule,
    UserModule,
    AuthModule,
    SchoolPageModule,
  ],
})
export class AppModule {}
