import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTypeDescription1699607064958 implements MigrationInterface {
    name = 'ChangeTypeDescription1699607064958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`description\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`description\` varchar(100) NOT NULL`);
    }

}
