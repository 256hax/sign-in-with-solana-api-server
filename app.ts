import createHttpError from 'http-errors';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger, { token } from 'morgan';
import cors from 'cors';

// Routes
import { router as authsRouter } from './app/contollers/auths';

const app = express();

// -------------------------------------------
//  App Config
// -------------------------------------------
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------
//  CORS Config
// -------------------------------------------
// // Add a list of allowed origins.
// // If you have more origins you would like to add, you can add them to the array below.
// const allowedOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];

// const options: cors.CorsOptions = {
//   origin: allowedOrigins,
//   credentials: true,
// };

// // Then pass these options to cors:
// app.use(cors(options));

app.use(cors()); // CORS-enabled for all origins

// -------------------------------------------
//  Routing
// -------------------------------------------
app.use('/auths', authsRouter);

// -------------------------------------------
//  Server Config
// -------------------------------------------
app.use((req: Request, res: Response, next: NextFunction) =>
  next(createHttpError(404))
);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

const port = 4100;
app.listen(port, () => {
  console.log(`start express server => http://localhost:${port}`)
});

module.exports = app;