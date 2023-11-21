import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDatabase1700033806943 implements MigrationInterface {
    name = 'UpdateDatabase1700033806943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`mainDescription\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`mainDescription\``);
        await queryRunner.query(`ALTER TABLE \`category\` ADD \`image\` varchar(255) NOT NULL`);
    }

}
