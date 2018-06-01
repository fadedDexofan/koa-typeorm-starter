import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class IntialSchema1527636567342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"),
        CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user" (
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "refresh_token" (
        "id" SERIAL NOT NULL,
        "refreshToken" text NOT NULL,
        "userUuid" uuid, CONSTRAINT
        "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "userUuid" uuid NOT NULL,
        "roleId" integer NOT NULL,
        CONSTRAINT "PK_704bbd0a86ed59214d539ad96ef" PRIMARY KEY ("userUuid", "roleId")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "refresh_token"
        ADD CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid")
    `);

    await queryRunner.query(`
      ALTER TABLE "user_roles"
        ADD CONSTRAINT "FK_dc7659b2e3cd0061a3c47278507" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid")
          ON DELETE CASCADE`);

    await queryRunner.query(`
      ALTER TABLE "user_roles"
        ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id")
          ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_dc7659b2e3cd0061a3c47278507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_7bcffdf3e178d0b35c0c50541ee"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
