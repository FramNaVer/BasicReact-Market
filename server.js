// step 1 import libraly
const express = require('express')
//ใช้สำหรับเรียกใช้งานง่ายๆ
const app = express()
const morgan = require('morgan')
const {readdirSync}  = require('fs')
const cors = require('cors')

// const authRouter = require('./routes/auth')
// const category = require('./routes/category')

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
// app.use('/api',authRouter)
// app.use('/api',category)


//step 3 Router
// app.post('/first', (req, res) => {
//     // code
//     const {email,username,Password} = req.body //Destucering
//     console.log(email,username,Password)
//     res.send('Hello')
// })

//เช็คตัวของโฟล์เดอร์ routes = auth , category , .....
//console.log(readdirSync('./routes'))

readdirSync('./routes')
.map((itemroutes)=> app.use('/api',require('./routes/'+itemroutes)))

// Step 2 Start server
app.listen(5000, () => console.log('Server is runing on port5000'))