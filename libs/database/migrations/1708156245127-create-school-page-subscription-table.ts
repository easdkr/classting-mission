import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchoolPageSubscriptionTable1708156245127 implements MigrationInterface {
  name = 'CreateSchoolPageSubscriptionTable1708156245127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "school_page_subscriptions" (
        "id" SERIAL NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "cancelled_at" TIMESTAMP,
        "user_id" integer NOT NULL, 
        "page_id" integer NOT NULL, 
        CONSTRAINT "idx_user_id_page_id_on_school_page_subscriptions" UNIQUE ("user_id", "page_id"), 
        CONSTRAINT "PK_cd9124d210226eebc4f98da2197" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "school_page_subscriptions" 
      ADD CONSTRAINT "FK_e63de7bb562dfc735004640d981" FOREIGN KEY ("page_id") REFERENCES "school_pages"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "school_page_subscriptions" 
      ADD CONSTRAINT "FK_5167d6b9fbcc29fb56fc4aee83d" FOREIGN KEY ("user_id") REFERENCES "users"("id") 
      ON DELETE CASCADE 
      ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "school_page_subscriptions" DROP CONSTRAINT "FK_5167d6b9fbcc29fb56fc4aee83d"`);
    await queryRunner.query(`ALTER TABLE "school_page_subscriptions" DROP CONSTRAINT "FK_e63de7bb562dfc735004640d981"`);
    await queryRunner.query(`DROP TABLE "school_page_subscriptions"`);
  }
}
