require("dotenv").config();
const express = require('express');
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const session = require("express-session");
const indexRouter = require('./routes/index');
const AdminRouter = require('./routes/admin');
const MySQLStore = require('express-mysql-session')(session);
const flash = require("express-flash");
const passport = require("passport");
const helmet = require('helmet');
const morgan = require('morgan');
var rfs = require('rotating-file-stream') // version 2.x
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
const { con, options } = require("./db/db");

//app.enable("trust proxy");

//app.set('trust proxy', false)



global.__basedir = __dirname;

//Pasport
require("./auth/passport")(passport);

//Helmet
app.use(
    helmet({
      hidePoweredBy: true,
    })
  );

//Static folder
app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/picUploads"));

//Express Session
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      name: "user_session",
      store: new MySQLStore(options, con),
    })
  );

//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(assignId);




app.use(flash());

//Error messages
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.err_msg = req.flash("err_msg");
    res.locals.error = req.flash("error");
    next();
  });


//View Engine Middleware
app.set('view engine', 'ejs');
app.use(expressLayouts);
// app.set('layout', 'layouts/layout');
app.set('views', __dirname + "/views");


//routes
app.use('/', indexRouter);
app.use('/admin', AdminRouter);
// app.get('/', (req, res) => {
//     res.render('index.ejs');
// });



function assignId (req, res, next) {
  req.id = uuid.v4()
  next()
}



//Server Middleware
const PORT = process.env.PORT || 8030;
app.listen(PORT, (err) => {
    if (err) {
        console.log("error: running this server");
    } else {
        console.log(`This application runs on http://localhost:${PORT}`);
    }
})
