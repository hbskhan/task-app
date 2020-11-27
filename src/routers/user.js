const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const { sendWelcomeEmail, sendCancelEmail } = require('../email/account.js')

const router = express.Router()

router.post('/users', async (req, res)=>{
    //console.log(req.body)
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.name, user.email)
        await user.save()
        res.status(201).send({user, token})
    }catch (e){
        res.status(400).send(e)
    } 
})

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch (e){
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
        await req.user.save()
        res.send()
    }catch (e){
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch (e){
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res)=>{
    //console.log(auth)
    res.send({'user': req.user})
})

router.patch('/users/me', auth, async(req, res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['age', 'name', 'email', 'password']

    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch (e){
        res.status(400).send(e)
    }

})

router.delete('/users/me', auth, async (req, res)=>{
    try{
        await req.user.remove()
        sendCancelEmail(req.user.name, req.user.email)
        res.send(req.user)
    }catch (e){
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {fileSize: 1000000},
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Image file format not supported"))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router