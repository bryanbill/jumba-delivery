import { DataTypes, Sequelize } from "sequelize";

/***
 * This is the driver model that will be used to create the driver table in the database
 * 
 * @param sequelize
 */
export const DriverModel = (sequelize: Sequelize) => sequelize.define("driver", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    latitude: {
        type: DataTypes.FLOAT
    },
    longitude: {
        type: DataTypes.FLOAT
    }
});