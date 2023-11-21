import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThumbnail1699324960541 implements MigrationInterface {
    name = 'AddThumbnail1699324960541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumnail\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumnail\``);
    }

}
