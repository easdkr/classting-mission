import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironment } from '@classting/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@classting/database';
import { UserModule } from '@classting/users/user.module';
import { RedisModule } from '@classting/redis';
import { HashModule } from '@classting/hash';
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
