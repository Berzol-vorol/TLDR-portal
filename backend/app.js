const express = require('express');
const mongoose = require('mongoose');

const summaryRoutes = require('./routes/summary-routes');
const usersRoutes = require('./routes/users-routes');
const reviewRoutes = require('./routes/review-routes');
const cors = require('cors')

const HttpError = require('./models/http-error');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()) // Use this after the variable declaration
app.use('/api/summaries', summaryRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reviews', reviewRoutes)

app.use((req, res, next) => {
    next(new HttpError('Could not find this route'), 404)
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  });

mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        app.listen(5001);
    })
    .catch(err => {
        console.log(err);
    });