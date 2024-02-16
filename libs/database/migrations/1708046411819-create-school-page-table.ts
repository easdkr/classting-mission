import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchoolPageTable1708046411819 implements MigrationInterface {
  name = 'CreateSchoolPageTable1708046411819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "school_pages" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "city" character varying NOT NULL, 
        "name" character varying NOT NULL, 
        CONSTRAINT "PK_c0be4a3cc51ac9360a375d8a907" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "school_pages"`);
  }
}
