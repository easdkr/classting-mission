import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintOnSchool1708083057812 implements MigrationInterface {
  name = 'AddUniqueConstraintOnSchool1708083057812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "school_pages" ADD CONSTRAINT "UQ_510806c2afc1714fad6c2061fd0" UNIQUE ("city", "name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "school_pages" DROP CONSTRAINT "UQ_510806c2afc1714fad6c2061fd0"`);
  }
}
