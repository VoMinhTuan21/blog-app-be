import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusInComment1700442638077 implements MigrationInterface {
    name = 'AddStatusInComment1700442638077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`status\` enum ('pending', 'confirmed') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`status\``);
    }

}
