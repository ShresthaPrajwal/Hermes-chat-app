const router = require('express').Router();

router.use('/auth',require('./auth'));
router.use('/chat',require('./chat'));
router.use('/socket',require('./socket'));

module.exports = router;