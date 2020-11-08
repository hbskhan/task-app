// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1/27017'
const databaseName = 'task-manager'

//const id = new ObjectID()
//console.log(id)

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
    if(error){
        return console.log('Cannot connect to database')
    }

    const db = client.db(databaseName)

    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: "Task2"
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

})