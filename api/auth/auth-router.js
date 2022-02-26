const router = require('express').Router();
const User = require('./auth-model')
const {checkValidUsername, checkresBody, checkUsernameExists} = require('./auth-middleware')
const {  BCRYPT_ROUNDS } = require("../../secrets"); 
const bcrypt = require("bcryptjs");
const makeToken = require('./auth-token-builde')


router.post('/register',
 checkresBody,
 checkValidUsername, 
 async  (req, res, next) => {

      try{
        const {username, password} = req.body 
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
        const user = await User.add({username, password: hash})
        res.status(201).json(user)
      }catch(err){
        next(err)
      }
});

router.post('/login', 
checkresBody, 
checkUsernameExists, 
async (req, res, next) => {
       const validPassword = bcrypt.compareSync(req.body.password, req.user.password)
       if(validPassword){
        const token = makeToken(req.user)
        return  res.status(200).json({ message: `${req.user.username} is back!`, token, subject: req.user.user_id})
       }else{
        next({ status: 404, message: "Invalid credentials"})
       }

});


module.exports = router;
