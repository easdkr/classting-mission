import { ConfigModuleOptions } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsString, validateSync } from 'class-validator';

enum Environment {
  DEV = 'development',
  PROD = 'production',
  TEST = 'test',
}

export class AppEnvironment {
  @IsEnum(Environment)
  public NODE_ENV: Environment;

  @IsInt()
  public APP_PORT: number;

  @IsString()
  public DATABASE_HOST: string;

  @IsString()
  public DATABASE_USER: string;

  @IsString()
  public DATABASE_PASSWORD: string;

  @IsInt()
  public DATABASE_PORT: number;

  @IsString()
  public DATABASE_NAME: string;

  @IsString()
  public SESSION_SECRET: string;

  @IsString()
  public REDIS_HOST: string;

  @IsInt()
  public REDIS_PORT: number;
}

export const validateEnvironment: ConfigModuleOptions['validate'] = (env) => {
  const validatedConfig = plainToInstance(AppEnvironment, env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
