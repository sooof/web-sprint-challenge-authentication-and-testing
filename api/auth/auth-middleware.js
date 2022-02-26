
const User = require('./auth-model')

const checkValidUsername = async (req, res, next) => {
    try{
        const {username} = req.body
        const existUser = await User.findBy({username})
        if(existUser){
            next({status: 404, message: "username taken"});
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}
const checkUsernameExists = async (req, res, next) => {
    try{
        const {username} = req.body
        const existUser = await User.findBy({username})
        if(!existUser){
            next({status: 400, message: "invalid credentials"});
        }else{
            req.user = existUser
            next()
        }
    }catch(err){
        next(err)
    }
}
const checkresBody = (req, res, next) => {
    try{
        const {username, password} = req.body
        if(!username || !username.trim() || !password || !password.trim()){
            next({status: 404, message: "username and password required"});
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}



module.exports = {
    checkValidUsername,
    checkUsernameExists,
    checkresBody,
}