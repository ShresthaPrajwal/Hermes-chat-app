const router = require('express').Router();

router.use('/auth',require('./routes/auth'));
router.use('/chat',require('./routes/chat'));
router.use('/socket',require('./routes/socket'));
router.use('/user',require('./routes/user'));
router.use('/friend',require('./routes/friend'))

module.exports = router;