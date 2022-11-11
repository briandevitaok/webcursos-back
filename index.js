require("dotenv").config()
const express = require('express')
const app = express()
const PORT = process.env.PORT 
const mongoose = require('mongoose')
const Course = require('./models/course')
const cors = require("cors")
const passport = require('./passport')



app.use(cors())
app.use(express.json())
app.use(passport.initialize())

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });



app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find()
    res.status(200).json({ok:true, data: courses})
  } catch (error) {
    console.log({error})
    res.status(400).json({ok:false, error})
  }
})



app.post('/courses', async (req, res) => {
    const {name} = req.body
    try {
      const result = await Course.create({name})
      res.status(200).json({ok:true})
    } catch (error) {
      console.log({error})
      res.status(400).json({ok:false, error})
    }
})


mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
})
.then((conn) =>{
  app.listen(PORT, async ()=>{
    console.log(`🚀Conexion en el puerto ${PORT} exitosa`)
  })
})
.catch((err)=>{
  console.log({err})
})

