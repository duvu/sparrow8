// const env_file = join(process.cwd(), '.env');
import {join} from "path";
//
// dotenv.config({ path: join(process.cwd(), '.env') });
// console.log('__dirname', join(process.cwd(), '.env'));
//
// export const sequelize = new Sequelize({
//     dialect: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     logging: false,
//     database: process.env.DB_NAME,
//     username: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     dialectOptions: {
//         useUTC: false, // for reading from database
//         timezone: '+07:00', // for writing to database
//     },
//     timezone: '+07:00', // for writing to database
//     pool: {
//         max: 10,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     },
// });
