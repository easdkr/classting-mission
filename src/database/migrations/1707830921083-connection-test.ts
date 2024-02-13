import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConnectionTest1707830921083 implements MigrationInterface {
  name = 'ConnectionTest1707830921083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT now()`);
  }
}
