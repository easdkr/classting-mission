import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchoolNewsTable1708058061701 implements MigrationInterface {
  name = 'CreateSchoolNewsTable1708058061701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "school_news" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "title" character varying NOT NULL, 
        "content" text NOT NULL, 
        "page_id" integer NOT NULL, 
        CONSTRAINT "PK_94aec05b329f71f66506b3000f1" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "school_news" 
       ADD CONSTRAINT "FK_36c75c7e1783a6f6511e4599acb" 
       FOREIGN KEY ("page_id") REFERENCES "school_pages"("id") 
       ON DELETE CASCADE 
       ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "school_news" DROP CONSTRAINT "FK_36c75c7e1783a6f6511e4599acb"`);
    await queryRunner.query(`DROP TABLE "school_news"`);
  }
}
