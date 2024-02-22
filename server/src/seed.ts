import { Server } from "socket.io";
import { DriverModel } from "./model/driver";
import { Sequelize } from "sequelize";

/**
 * This is a seed function that will be used to update the driver's location every 5 seconds: Mocks real-time location update
 * 
 * @param io 
 * 
 * @param sequelize 
 */
const seed = async (io: Server, sequelize: Sequelize) => {
    try {

        setInterval(async () => {
            const drivers = await DriverModel(sequelize).findAll();

            drivers.forEach(async (driver) => {
                const res = await driver.update({
                    latitude: driver.dataValues.latitude + Math.random() / 1000,
                    longitude: driver.dataValues.longitude + Math.random() / 1000
                });

                io.emit("driver_location_update", {
                    id: res.dataValues.id,
                    latitude: res.dataValues.latitude,
                    longitude: res.dataValues.longitude
                });
            });

        }, 5000);

    } catch (err) {
        console.error(err);
    }
}

export default seed;
