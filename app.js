const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const globalRoutes = require('./routes/global');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(express.static("public"));
app.use(cookieParser());

const limiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    limit: 100
});

app.use(limiter);

app.use('/api', globalRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error({ statusCode, message });

    res.status(statusCode).json({ statusCode, message, success: false });
});

const gracefulShutdown = async () => {
    console.log('Shutting down server gracefully!');
    try {
        await mongoose.disconnect();
        console.log('Info: MongoDB connection closed!');
    } catch (error) {
        console.error('Error: Error while shutting down server gracefully!', error);
    } finally {
        process.exit(0);
    }
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = app;