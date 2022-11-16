require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const Course = require('./models/course');
const cors = require('cors');
const passport = require('./passport');
const genereteJWT = require('./helpers/genereteJWT');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(
  require('express-session')({
    secret: 'jsjsjsjskweesq',
    resave: true,
    saveUninitialized: true,
  })
);


app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http:localhost:3000/login',
  }),
  function (req, res) {
    const { _id, firstname, lastname, email, pictureUrl } = req.user;
    const userData = {
      _id,
      firstname,
      lastname,
      email,
      pictureUrl,
    };
    const jwt = genereteJWT(userData);
    const login_info = JSON.stringify({ jwt, user: userData });
    res.redirect(`http://localhost:3000/profile?login_info=${login_info}`);
  }
);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get(
  '/courses',
  async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json({ ok: true, data: courses });
    } catch (error) {
      console.log({ error });
      res.status(400).json({ ok: false, error });
    }
  }
);


app.get(
  '/courses/:id',
  async (req, res) => {
    const {id} = req.params
    console.log({id})
    try {
      const course = await Course.findById(id);
      res.status(200).json({ ok: true, data: course });
    } catch (error) {
      console.log({ error });
      res.status(400).json({ ok: false, error });
    }
  }
);



app.post('/courses', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await Course.create({ name });
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log({ error });
    res.status(400).json({ ok: false, error });
  }
});

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    app.listen(PORT, async () => {
      console.log(`🚀Conexion en el puerto ${PORT} exitosa`);
    });
  })
  .catch((err) => {
    console.log({ err });
  });
