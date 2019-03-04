const router = require('express').Router();
const bcrypt = require('bcryptjs');

const db = require('../../data/dbConfig.js');
const Users = require('./users-model.js');

router.get('/', (req, res) => {
    res.send("It's Working!");
});

router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 12);

    user.password = hash;

    Users.add(user)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `${user.username} is logged in.` });
            } else {
                res.status(401).json({ message: 'You shall not pass!' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;
