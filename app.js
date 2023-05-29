require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');

const { PORT, BASE_PATH, DataBase } = require('./config');

const app = express();

app.use(helmet());

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://edwardmovies.nomoredomains.monster',
  credentials: true,
}));

// {
//   allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept',
// }

mongoose.connect(DataBase, {
  useNewUrlParser: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log('Ссылка на сервер');
    console.log(BASE_PATH);
  }, (err) => {
    console.log(err);
  });
});

app.use(requestLogger);

app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
