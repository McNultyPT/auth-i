const router = require('express').Router();

router.get('/', (req, res) => {
    res.send(`Today me will live in the moment, unless it's unpleasant, in which case me will eat a cookie. -Cookie Monster`);
});

module.exports = router;