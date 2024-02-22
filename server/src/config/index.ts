import { configDotenv } from 'dotenv';
import Database from './database';

configDotenv({
    path: `.env`
});

/**
 * Global configuration object
 */
const config = {
    APP: {
        ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 8000,
        HOST: process.env.HOST || 'http://localhost',
    },
    DB: {
        HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        DB_DIALECT: process.env.DB_DIALECT,
    }
};

export default config;
