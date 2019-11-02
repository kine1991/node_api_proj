const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')

const carRouter = require('./routes/carRoutes');
const articleRouter = require('./routes/articleRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARE
app.use(cors());
// Security HTTP headers
app.use(helmet()); // устанавливает защищеные header

// Development login
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// rateLimit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try this again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization agains XSS
app.use(mongoSanitize()); // предотвращаем атаку вида email: {"$gt": ""}

// Data sanitization agains MoSQL query injection
app.use(xss()); // prevent attack through html
// Prevent parametr polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
); // если ввести два параметра ?sort=name&sort=age получаеться загрязненние параметров при использовании hpp() будет применятья последний sort=age

// Serving static files
app.use(express.static(`${__dirname}/public`));

// testing
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
