const mongoose = require('mongoose');
const { DATABASE } = require('../utils/constants');

const connectDB = async () => {
    const maxRetries = 3;
    let attempt = 0;

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI || !DATABASE) {
        throw new Error('MONGO_URI or DATABASE is not defined.');
    }

    const MONGO_URL = MONGO_URI + DATABASE;

    while (attempt < maxRetries) {
        try {
            const connectionInstance = await mongoose.connect(MONGO_URL, {
                maxPoolSize: 10
            });
            console.log("Info: Database connected successfully!");
            console.log(`Info: Connected to MongoDB at ${connectionInstance.connection.host}:${connectionInstance.connection.port}`);
            break;
        } catch (error) {
            attempt++;
            console.error(`Error: MONGODB Connection Attempt ${attempt} Failed!`, error.message);

            if (attempt === maxRetries) {
                console.error('Max retries reached. Unable to connect to MongoDB.');
                throw new Error('Unable to connect to MongoDB after multiple attempts.');
            }

            console.log(`Retrying in 5 seconds...`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
}

module.exports = connectDB;
