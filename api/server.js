const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('../data/dbConfig.js');

const usersRouter = require('./users/users-router.js');
const restrictedRouter = require('./users/restricted-router.js');

const server = express();

const sessionConfig = {
    name: 'cookieMonster',
    secret: 'C is for cookie.',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        knex: db,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

function restricted (req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: `I'd give you a cookie, but I ate it, and your credentials are invalid.`})
    }
 }

server.use('/api/', usersRouter);
server.use('/api/restricted/', restricted, restrictedRouter);

module.exports = server;