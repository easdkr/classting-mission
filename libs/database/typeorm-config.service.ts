import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join as pathJoin } from 'path';
import { AppEnvironment } from '@libs/configs';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly configService: ConfigService<AppEnvironment>) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const baseDir = pathJoin(__dirname, '../..');
    const entitiesPath = `${baseDir}/**/*.entity.{js, ts}`;
    const migrationPath = `${baseDir}/migrations/**/*.{js, ts}`;

    return {
      type: 'postgres',
      database: this.configService.get('DATABASE_NAME'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      port: this.configService.get('DATABASE_PORT'),
      entities: [entitiesPath],
      migrations: [migrationPath],
      logging: true,
      synchronize: false,
      autoLoadEntities: true,
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'migrations',
        subscribersDir: 'subscriber',
      },
    } as TypeOrmModuleOptions;
  }
}
