const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Bem-vindo à API de autenticação." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const sequelize = require('./src/config/database');
const User = require('./src/models/user');

sequelize.sync().then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch(err => {
    console.error('Erro ao conectar com o banco de dados:', err);
});
