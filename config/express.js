let express = require("express");
let createError = require("http-errors");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors")

let indexRouter = require("../web9ja_backend/routes/index");
let usersRouter = require("../web9ja_backend/routes/users");
let adsRouter = require("../web9ja_backend/routes/ads");

let app = express();

// Enable cors.
app.use(cors());
app.options('*', cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ads", adsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
