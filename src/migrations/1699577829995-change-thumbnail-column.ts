import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeThumbnailColumn1699577829995 implements MigrationInterface {
    name = 'ChangeThumbnailColumn1699577829995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumnail\` \`thumbnail\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumbnail\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumbnail\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumbnail\` \`thumnail\` varchar(255) NOT NULL`);
    }

}
