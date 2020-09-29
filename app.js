require("dotenv").config();
require("./config/mongodb"); 

// base dependencies
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const hbs = require("hbs");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const dev_mode = false;
const logger = require("morgan");

// config logger (pour debug)
app.use(logger("dev"));

// initial config
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));
hbs.registerPartials(__dirname + "/views/partials");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

 //SESSION SETUP
 app.use(
    session({
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {maxAge: 3000000},
    })
  ); // Creates a session object, gives a cookie to client that the client sends back on every request

app.use(flash());

// routers
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/timeline", require("./routes/timeline"));

//MIDDLEWARES
app.use(require("./middlewares/exposeFLashMessage"));
app.use(require("./middlewares/exposeLoginStatus"));

module.exports = app;
