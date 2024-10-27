const {MongoClient} = require("mongodb");
const dotenv = require("dotenv").config(); 

let database; 

const initDB = (callback) => {
    if (database) {
        console.log("Database is already initialized.");
        return callback(null, database); // Call the callback with the database if already initialized
    }

    MongoClient.connect(process.env.DATABASE_URL)
        .then((client) => {
            database = client.db("Ties_inventory") // Store the database connection
            console.log('Connected to MongoDB');
            callback(null, database); // Call the callback on success
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
            callback(err); // Call the callback with the error
        });
};

const getDatabase = () => {
    if (!database) {
        throw new Error("Database not initialized. Call initDB first.");
    }
    return database; 
};

module.exports = { initDB, getDatabase };


