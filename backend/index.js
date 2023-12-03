const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())

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

const mongoURI = 'mongodb+srv://bernadadmytryi:9u21knGf7tb3ycv6@fivard.inueahe.mongodb.net/?retryWrites=true&w=majority'

mongoose
    .connect(mongoURI)
    .then(() => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });