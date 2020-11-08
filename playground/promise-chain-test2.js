const e = require('express')
//const User = require('../src/models/user.js')
const Task = require('../src/models/task.js')
require('../src/db/mongoose.js')

const _id = "5f7e1ed7f3745323801f1459"

// Task.findByIdAndDelete(_id).then((task)=>{
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then((num)=>{
//     console.log(num)
// }).catch((error)=>{
//     console.log(error)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return count
}

deleteTaskAndCount('5f7e56d269ccc50ba041902a').then((count)=>{
    console.log(count)
}).catch((error)=>{
    console.log(error)
})

