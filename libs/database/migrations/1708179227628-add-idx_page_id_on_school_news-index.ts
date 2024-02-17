import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdxPageIdOnSchoolNewsIndex1708179227628 implements MigrationInterface {
  name = 'AddIdxPageIdOnSchoolNewsIndex1708179227628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "idx_page_id_on_school_news" ON "school_news" ("page_id") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_page_id_on_school_news"`);
  }
}
