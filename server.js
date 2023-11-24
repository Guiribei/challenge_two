const app = require('./app');
const sequelize = require('./src/config/database');


const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
	console.log('Conexão com o banco de dados estabelecida com sucesso.');
	app.listen(PORT, () => {
		console.log(`Servidor rodando na porta ${PORT}`);
	});
}).catch(err => {
	console.error('Erro ao conectar com o banco de dados:', err);
});
