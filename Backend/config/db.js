const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        
        // Sync all models
        await sequelize.sync({ alter: true });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };