const express =require('express')
const app = express()

require('dotenv').config()

//db connection import
require('./database/databaseconnection')

//cors to resolve cross origin policy error
const cors=require('cors')
app.use(cors({origin:"http://localhost:3000",credentials:true}))

// cookie parser to send and retrieve cookie
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.json())
//router
const router=require('./routes/router')
app.use('/',router)

const port = process.env.PORT || 5000



app.listen(port,()=>{
    console.log('server running succesfully at port : '+port)
})




