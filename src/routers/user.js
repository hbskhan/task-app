const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const router = express.Router()

router.post('/users', async (req, res)=>{
    //console.log(req.body)
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
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
        res.send(req.user)
    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router