const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth.js')
const router = express.Router()

router.post('/tasks', auth, async(req, res)=>{
    //console.log(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id

    try{
        const tasks = await Task.findOne({_id, owner: req.user._id})
        if(!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }

})

router.get('/tasks', auth, async (req, res)=>{
    
    try{
        const tasks = await Task.find({owner: req.user._id})
        if(!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']

    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        const task = await Task.findOne({_id, owner: req.user._id})
        
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()

        res.send(task)
    }catch (e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router