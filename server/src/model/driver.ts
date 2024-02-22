import { DataTypes, Sequelize } from "sequelize";


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