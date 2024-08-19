const authRouter = require('express').Router();
const authController = require('../controllers/auth');
authRouter.get('/',(req,res)=>{
  res.json({ message: "auth" });
})

authRouter.post('/register',authController.register);
authRouter.post('/login',authController.login);

module.exports = authRouter;