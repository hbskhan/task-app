const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'testingjwttoken')
        const user = await User.findOne({_id: decode._id, 'tokens.token': token})
        console.log(user)
        if(!user){
            throw new Error()
        }
        req.user = user
        next()

    }catch (e){
        res.status(401).send({error: 'Please Login'})
    }
    
}

module.exports = auth