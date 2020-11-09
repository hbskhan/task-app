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

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }

})



router.patch('/users/:id', async(req, res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['age', 'name', 'email', 'password']

    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        if(!user){
            console.log('No user found')
            return res.status(404).send()
        }

        res.status(200).send(user)

    }catch (e){
        res.status(400).send(e)
    }

})

router.delete('/users/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const user = await User.findByIdAndDelete(_id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)

    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router