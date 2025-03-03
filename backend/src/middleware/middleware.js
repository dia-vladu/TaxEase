const express = require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

module.exports = (app) => {
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, //Allow cookies and credentials
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    session({
      key: "userId",
      secret: "mySecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000, //1 hour
        httpOnly: true
      }
    })
  );
};
