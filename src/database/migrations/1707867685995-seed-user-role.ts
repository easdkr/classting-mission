import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserRole1707867685995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('admin'), ('member')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE roles`);
  }
}
