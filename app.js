const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')

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

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find url ${req.originalUrl} on server`);
  // err.status = 'fail';
  // err.statusCode = '404';
  // next(err);
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err); // при ошибке переходит к app.use((err, req, res, next) => ... см. ниже передает туда  err
})

app.use(globalErrorHandler);
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'fail';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });

// SERVER 
module.exports = app;
