const { response } = require('express')
const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
require('./db/mongoose.js')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//     if(req){
//         res.status(503).send('Site under maintainance')
//     }
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('SERVER UP ON ' + port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async() =>{
    const user = await User.findById('5faeaff546a50441b0a91ca1')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()