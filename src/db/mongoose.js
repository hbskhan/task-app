const mongoose = require('mongoose')
//Connect to database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

//"mongodb\bin\mongod.exe" --dbpath "mongodb-data"
