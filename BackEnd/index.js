const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')
const bodyparser = require('body-parser')
const cors = require('cors')
const auth = require('./routes/authRoute')
const cookieParser = require('cookie-parser')

PORT = process.env.PORT || 3000;
app.use(cookieParser())
app.use(cors());
app.use(bodyparser.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));


app.get('/api', (req,res)=>{
  res.send("welcoagnlag aglsf")
})

app.use('/api',auth)

app.listen(PORT, ()=>{
  console.log(`server is runnig on port ${PORT}`);
})