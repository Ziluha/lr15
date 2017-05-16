'use strict';

var express = require('express');
const config = require('./config');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const easyxml = require('easyxml');
var output = require('./output');

const dbcontext = require('./context/db')(Sequelize, (process.env.lr12key==null) ? config.db : config.postgres);
const usersServices = require('./services/users')(dbcontext.users);
const domainsServices = require('./services/domains')(dbcontext.domains);
const paymentsServices = require('./services/payments')(dbcontext.payments, dbcontext.users, dbcontext.domains);

const apiController = require('./controllers/api')(usersServices, domainsServices, paymentsServices);
var app = express();
var router = express.Router();
router.use((req,res,next)=>{output.removeRoot(req,res,next)});

var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(bodyParser.xml({xmlParseOptions: {explicitArray: false}}));

app.use('/api', router);
app.use('/api', apiController);

dbcontext.sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT||3030, () => console.log('Running on http://localhost:3030'));
    })
    .catch((err) => console.log(err));

