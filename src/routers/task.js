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
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const sortSplit = req.query.sortBy.split(':')
        sort[sortSplit[0]] = sortSplit[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
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