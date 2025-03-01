const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'oracle',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectOptions: {
    charset: 'AL32UTF8',
    collate: 'AL32UTF8_BIN', // for comparisons
  }
});

const syncDB = async () => {
  try {
    await sequelize.sync(); //{alter: true} To sync sequelize changes with DB -- only for dev.
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
};

syncDB();

module.exports = sequelize;