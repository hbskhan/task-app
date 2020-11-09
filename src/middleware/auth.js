const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decode = jwt.verify(token, 'testingjwttoken')
        //console.log(decode._id)
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        //console.log(user)
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()

    }catch (e){
        res.status(401).send({error: 'Please Login'})
    }
    
}

module.exports = auth