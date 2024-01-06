const { signUp, login, forgetPass,  validateOTP , getData} = require('../controllers/userControllers');
// const { protect } = require('../middlewares/authMiddleware');

const userRouter = require('express').Router();

userRouter.post("/login" , login );
userRouter.post("/signup" , signUp);
userRouter.post("/forgetpassword" , forgetPass);
userRouter.post("/validateOTP" , validateOTP);
userRouter.get("/getData" , getData);
module.exports = userRouter;