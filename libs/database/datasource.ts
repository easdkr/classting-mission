import { DataSource, DataSourceOptions } from 'typeorm';

const entitiesPath = `${__dirname}/../../**/*.entity.{js,ts}`;
const migrationPath = `${__dirname}/migrations/**/*.{js,ts}`;

export const AppDataSource = new DataSource({
  type: 'postgres',
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: +process.env.DATABASE_PORT,
  entities: [entitiesPath],
  migrations: [migrationPath],
  logging: true,
  synchronize: false,
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'migrations',
  },
} as DataSourceOptions);
