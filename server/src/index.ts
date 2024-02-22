import express, { Express, Request, Response } from 'express';
import { Server } from 'socket.io';
import { Driver } from '../../common/interface';
import { DriverModel } from './model/driver';
import Database from './config/database';
import seed from './seed';

/**
 * This is the entry point of the application
 * 
 * @returns void
 */
const init = async () => {
    try {

        // Connect to the database and possibly create the tables
        const sequelize = await new Database().sync();
        if (!sequelize) throw new Error('Database connection failed');

        // Create the table if it does not exist
        await DriverModel(sequelize).sync();

        const app: Express = express();
        const PORT = 8000;

        app.use(express.json());

        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Create a new instance of the socket.io server
        const io = new Server(server, {
            cors: {
                origin: '*',
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000,
                skipMiddlewares: true,
            },
        });

        // Seed the database with some initial data and mock real-time location update
        await seed(io, sequelize);

        io.on('connection', (socket) => {
            console.log('A user connected');

            // Listen for request to get all drivers
            socket.on('get_drivers', async (_) => {
                const data = await DriverModel(sequelize).findAll();

                const drivers: Driver[] = data.map((driver) => {
                    const values = driver.dataValues;
                    return {
                        id: values.id,
                        name: values.name,
                        latitude: values.latitude,
                        longitude: values.longitude,
                        updates: [
                            {
                                latitude: values.latitude,
                                longitude: values.longitude
                            }
                        ]
                    };
                });

                socket.emit('drivers', drivers);
            })

            socket.on('disconnect', () => {
                console.log('A user disconnected');
            });
        });

    } catch (err) {
        console.log("Something went wrong: ", err);
    }
}

init();