import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed1527639421869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    /* await queryRunner.query(`
      INSERT INTO "role"
        VALUES (DEFAULT, 'user'), (DEFAULT, 'admin');`); */
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM "role";`);
  }
}
