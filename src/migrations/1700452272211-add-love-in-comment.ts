import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoveInComment1700452272211 implements MigrationInterface {
    name = 'AddLoveInComment1700452272211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`love\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`love\``);
    }

}
