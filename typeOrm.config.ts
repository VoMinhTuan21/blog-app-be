import { DataSource } from 'typeorm';
require('dotenv').config();

export default new DataSource({
    type: 'mysql',
    port: Number(process.env.RDS_PORT) || 3306,
    host: process.env.RDS_HOST,
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    synchronize: false,
    logging: false,
    entities: ['./src/entities/*.ts'],
    migrations: ['./src/migrations/*.ts'],
    subscribers: ['./src/subscriber/*.ts'],
});
