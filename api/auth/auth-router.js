const router = require('express').Router();
const User = require('./auth-model')
const {checkValidUsername, checkresBody, checkUsernameExists} = require('./auth-middleware')
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../../secrets"); 
const bcrypt = require("bcryptjs");
const makeToken = require('./auth-token-builde')
// const jwt = require('jsonwebtoken')

router.post('/register',
 checkresBody,
 checkValidUsername, 
 async  (req, res, next) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
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
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
      // res.status(201).json("post /api/auth/login")
      // const {password} = req.body
      // console.log("data password =", req.user.password)
      // console.log("body password = ", password)
      // const validPassword = bcrypt.compareSync(password, req.user.password)
      //  console.log(validPassword)
       const validPassword = bcrypt.compareSync(req.body.password, req.user.password)
       if(validPassword){
        const token = makeToken(req.user)
        return  res.status(200).json({ message: `${req.user.username} is back!`, token, subject: req.user.user_id})
       }else{
        next({ status: 404, message: "Invalid credentials"})
       }

});
// router.get('/', async (req, res, next)=>{
//   try{
//     const user = await User.find()
//     res.json(user)
//   }catch(err){
//     next(err)
//   }
// })

// function makeToken(user) {
//   const payload = {
//       subject: user.id,
//       username: user.username,
//   }
//   const options = {
//       expiresIn: '1d'
//   }
//   return jwt.sign(payload, JWT_SECRET, options);
// }

module.exports = router;
