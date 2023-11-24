const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({message: 'Bem-vindo à API de autenticação.'});
});

module.exports = app;
