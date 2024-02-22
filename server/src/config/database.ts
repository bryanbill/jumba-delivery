import { Sequelize } from 'sequelize';
import config from '.';

class Database {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(`${config.DB.DB_DIALECT}://${config.DB.DB_USER}:${config.DB.DB_PASSWORD}@${config.DB.HOST}:${config.DB.DB_PORT}/${config.DB.DB_NAME}`, {
            logging: false,
        });
    }

    async sync(force?: boolean) {
        try {
            await this.sequelize.authenticate({
                logging: false,
            })

            await this.sequelize.sync({ force,  });

            return this.sequelize;

        } catch (err) {
            console.log("Error while connecting to the database: ", err);
        }
    }
}

export default Database;