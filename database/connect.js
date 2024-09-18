const mongoose = require('mongoose')


const connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
    console.log('Mongodb Atlas connected');
    
}).catch(err=>{
    console.log('Mongodb Atlas connection failed',err);
    
})