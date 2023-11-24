require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../app');
const sequelize = require('../src/config/database.js');
const User = require('../src/models/user');
let token;
beforeAll(async () => {
	await sequelize.sync();
});

afterAll(async () => {
	await sequelize.sync({ force: true });
});

describe('Sign Up', () => {
	test('Deve criar um novo usuário e retornar o id e email', async () => {
		const response = await request(app)
			.post('/api/users/signup')
			.send({
				email: 'test@exampletest.com',
				password: 'password123'
			});
		
		expect(response.statusCode).toBe(201);
		expect(response.body.email).toBe('test@exampletest.com');
		expect(response.body.password).toBe();
	});

	test('Não deve permitir a criação de um usuário com e-mail já existente', async () => {
		await request(app)
			.post('/api/users/signup')
			.send({ email: 'duplicado@example.com', password: 'senha123' });
	
		const response = await request(app)
			.post('/api/users/signup')
			.send({ email: 'duplicado@example.com', password: 'senha123' });
	
		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({ mensagem: "E-mail já existente" });
	});

});

describe('Sign In', () => {
	test('Deve autenticar o usuário e retornar um token JWT', async () => {
		const response = await request(app)
			.post('/api/users/signin')
			.send({
				email: 'test@exampletest.com',
				password: 'password123'
			});
			token = response.body.token;
		expect(response.statusCode).toBe(200);
		expect(response.body.token).toBeDefined();
	});

	test('Não deve autenticar com e-mail inexistente', async () => {
		const response = await request(app)
			.post('/api/users/signin')
			.send({ email: 'naoexistente@example.com', password: 'senha123' });
	
		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({ mensagem: "Usuário e/ou senha inválidos" });
	});

	test('Não deve autenticar com senha incorreta', async () => {
		const response = await request(app)
			.post('/api/users/signin')
			.send({ email: 'test@exampletest.com', password: 'wrongone' });
	
		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({ mensagem: "Usuário e/ou senha inválidos" });
	});
	
});

describe('Recuperação de Informações do Usuário', () => {

	test('Deve retornar as informações do usuário', async () => {
		const response = await request(app)
			.get('/api/users/user')
			.set('Authorization', `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.email).toBe('test@exampletest.com');
	});

	test('Não deve retornar informações do usuário com token inexistente', async () => {
		const tokenInvalido = '';
		const response = await request(app)
			.get('/api/users/user')
			.set('Authorization', `Bearer ${tokenInvalido}`);

		expect(response.statusCode).toBe(401);
		expect(response.body).toEqual({ mensagem: "Não autorizado" });
	});

	test('Não deve retornar informações do usuário com token inválido', async () => {
		const tokenInvalido = 'XXXXXXXXX';
		const response = await request(app)
			.get('/api/users/user')
			.set('Authorization', `Bearer ${tokenInvalido}`);

		expect(response.statusCode).toBe(403);
		expect(response.body).toEqual({ mensagem: "Sessão inválida" });
	});
});

afterAll(async () => {
	await sequelize.close();
});
