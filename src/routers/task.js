const express = require('express')
const Task = require('../models/task.js')
const router = express.Router()

router.post('/tasks', async(req, res)=>{
    //console.log(req.body)
    const task = new Task(req.body)
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

router.get('/tasks/:id', async (req, res)=>{
    const id = req.params.id

    try{
        const task = await Task.findById(id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }

})

router.get('/tasks', async (req, res)=>{
    
    try{
        const tasks = await Task.find()
        if(!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id', async (req, res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const validUpdates = ['description', 'completed']

    const isValidUpdate = updates.every((update) => validUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error: 'Invalid Update'})
    }

    try{
        const task = await Task.findById(_id)
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()
        
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch (e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async(req, res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findByIdAndDelete(_id)

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch (e){
        res.status(500).send(e)
    }
})

module.exports = router