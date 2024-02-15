import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironment } from '@libs/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@libs/database';
import { RedisModule } from '@libs/redis';
import { HashModule } from '@libs/hash';
import { UserModule } from '@classting/users';
import { AuthModule } from '@classting/auth';

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
    RedisModule,
    HashModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
