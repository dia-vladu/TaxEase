require('dotenv').config();
const express = require('express');
const applyMiddleware = require('./middleware/middleware.js');
//const config = require('./config');
const sequelize = require('./sequelize');
const routes = require('./routes/index.js');
const errorHandler = require('./middleware/errorHandler.js');

const app = express();

applyMiddleware(app);
app.use("/", express.static("public"));

// Dynamically mount all routes
//console.log(routes);
app.use('/api', routes);

app.use(errorHandler);

app.set("port", process.env.PORT || 8080)

app.listen(app.get("port"), async () => {
    console.log(`Server is running on http://localhost:${app.get("port")}`);
    try {
        await sequelize.authenticate();
        console.log('Connection to Oracle Express database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the Oracle Express database:', error);
    }
});