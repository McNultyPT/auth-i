const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Restricted Content');
});

module.exports = router;