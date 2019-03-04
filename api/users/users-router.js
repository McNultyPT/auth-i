const router = require('express').Router();
const knex = require('knex');
const bcrypt = require('bcryptjs');

const db = require('../../data/dbConfig.js');
const Users = require('./users-model.js');

router.get('/', (req, res) => {
    res.send("It's Working!");
});

module.exports = router;
