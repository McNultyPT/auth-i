const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./users-model.js');

function restricted (req, res, next) {
   if (req.session && req.session.user) {
       next();
   } else {
       res.status(401).json({ message: `I'd give you a cookie, but I ate it, and your credentials are invalid.`})
   }
}

router.post('/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 12);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            req.session.user = saved;
            res.status(201).json(saved);
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
                req.session.user = user;
                res.status(200).json({ message: `Welcome ${user.username}, have a cookie...om nom nom nom.` });
            } else {
                res.status(401).json({ message: `I'd give you a cookie, but I ate it, and your credentials are invalid.` });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send('Me want cookie, but there was an error logging out!')
            } else {
                res.send('Goodbye! No cry because cookie is finished. Smile because cookie happened.')
            }
        })
    } else {
        res.end();
    }
});

module.exports = router;
