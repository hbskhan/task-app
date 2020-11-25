const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const { Binary } = require('mongodb')

const userSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        trim: true 
    },
    age:{ 
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive')
            }
        }
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password connot contain password')
            }
        }
    },
    avatar:{type: Buffer},
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, { timestamps: true })

userSchema.methods.toJSON = function() {
    const publicData = this.toObject()

    delete publicData.password
    delete publicData.tokens

    return publicData
}

userSchema.methods.generateAuthToken = async function() {
    const token =  jwt.sign({_id: this._id.toString()}, 'testingjwttoken')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Login Failed')
    }

    const isVerified = await bcrypt.compare(password, user.password)
    if(!isVerified){
        throw new Error('Login Failed')
    }

    return user
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next){
    //console.log('Pre save')
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    await Task.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User