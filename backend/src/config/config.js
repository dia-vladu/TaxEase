require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
};
