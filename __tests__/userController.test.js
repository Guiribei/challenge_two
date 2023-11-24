require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../app');
const sequelize = require('../src/config/database.js');
const User = require('../src/models/user');

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


});

describe('Sign In', () => {
    test('Deve autenticar o usuário e retornar um token JWT', async () => {
        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@exampletest.com',
                password: 'password123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

});

afterAll(async () => {
    await sequelize.close();
});
