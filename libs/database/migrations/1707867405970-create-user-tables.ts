import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTables1707867405970 implements MigrationInterface {
  name = 'CreateUserTables1707867405970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" (
        "id" SERIAL NOT NULL, 
        "name" character varying NOT NULL, 
        CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "email" character varying NOT NULL, 
        "password" character varying NOT NULL, 
        "provider" character varying NOT NULL DEFAULT 'email', 
        "roleId" integer NOT NULL, 
        CONSTRAINT "idx_email_on_users" UNIQUE ("email"), 
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" 
       ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" 
       FOREIGN KEY ("roleId") REFERENCES "roles"("id") 
       ON DELETE NO ACTION 
       ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
