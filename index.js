const app = require('./app');
const connectDB = require('./db/dbConnection');

function startServer() {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log("Info: Server started on PORT:", PORT);
    });
}

connectDB()
    .then(startServer)
    .catch(error => {
        console.error("Error: Something went wrong while contacting DATABASE !", error.message);
        process.exit(1);
    });