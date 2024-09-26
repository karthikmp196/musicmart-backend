require('dotenv').config()
const express = require('express')
const cors= require('cors')
const router = require('./router/router')
require('./database/connect')

const server = express()

server.use(cors())
server.use(express.json())
server.use(router)
server.use('/uploads',express.static('./uploads'))

const port = 4000 || process.env.PORT
server.listen(port,()=>{
    console.log(`server is running on ${port}`);
    
})

server.get('/',(req,res)=>{
    res.send(`<h1>Server is running </h1>`)
})