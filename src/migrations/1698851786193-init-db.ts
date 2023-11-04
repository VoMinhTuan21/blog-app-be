import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1698851786193 implements MigrationInterface {
    name = 'InitDb1698851786193';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`account\` (\`socialId\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, PRIMARY KEY (\`socialId\`, \`type\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`description\` varchar(255) NOT NULL, \`user_id\` varchar(36) NULL, \`post_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`post\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(100) NOT NULL, \`description\` varchar(100) NOT NULL, \`category_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `CREATE TABLE \`category\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(100) NOT NULL, \`image\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
        await queryRunner.query(
            `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_efef1e5fdbe318a379c06678c51\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_bbfe153fa60aa06483ed35ff4a7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_8aa21186314ce53c5b61a0e8c93\` FOREIGN KEY (\`post_id\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_388636ba602c312da6026dc9dbc\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`post\` ADD CONSTRAINT \`FK_52378a74ae3724bcab44036645b\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_52378a74ae3724bcab44036645b\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_388636ba602c312da6026dc9dbc\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_8aa21186314ce53c5b61a0e8c93\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_bbfe153fa60aa06483ed35ff4a7\``,
        );
        await queryRunner.query(
            `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_efef1e5fdbe318a379c06678c51\``,
        );
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`account\``);
    }
}
