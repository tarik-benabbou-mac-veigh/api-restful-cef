const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Connexion base de données :
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

const app = express();

// Utilisation de cors :
app.use(cors({
    exposeHeaders: ['Authorisation'],
    origin: '*',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next)=>{
    res.status(404).json({
        name:'API',
        version: '1.0',
        status: 404,
        message: 'not_found',
    });
});

module.exports = app;
