const express = require('express');
const morgan = require('morgan');

const carRouter = require('./routes/carRoutes');
// const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/cars', carRouter);
// app.use('/api/v1/users', userRouter);

// SERVER
module.exports = app;
