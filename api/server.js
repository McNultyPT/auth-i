const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const Users = require('./users/users-model.js');

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
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/', usersRouter);
server.use('/api/restricted', restricted, restrictedRouter);

function restricted (req, res, next) {
    const { username, password } = req.body;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: 'You shall not pass!' });
                }
            })
            .catch(err => {
                res.status(500).json(err);
            })
    } else {
        res.status(400).json({ message: 'Please provide your credentials.' });
    }
}

module.exports = server;