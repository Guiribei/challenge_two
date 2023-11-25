require('dotenv').config({path: '.env.test'});
const request = require('supertest');
const app = require('../app');
const sequelize = require('../src/config/database.js');

let token;
beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.sync({force: true});
});

describe('Sign Up', () => {
  test('Deve criar um novo usuário e retornar o id e email', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
          nome: 'Teste',
          email: 'test@exampletest.com',
          senha: 'password123',
          telefones: [{numero: '123456789', ddd: '11'}],
        });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      data_criacao: expect.any(String),
      data_atualizacao: expect.any(String),
      ultimo_login: expect.any(String),
      token: expect.any(String),
    });
    expect(response.body.senha).toBeUndefined();
  });

  test('Não deve permitir a criação de um usuário com e-mail já existente',
      async () => {
        // Primeira tentativa de cadastro
        await request(app)
            .post('/api/users/signup')
            .send({
              nome: 'Usuário Duplicado',
              email: 'duplicado@example.com',
              senha: 'senha123',
              telefones: [{numero: '123456789', ddd: '11'}],
            });

        // Segunda tentativa de cadastro com o mesmo e-mail
        const response = await request(app)
            .post('/api/users/signup')
            .send({
              nome: 'Usuário Duplicado',
              email: 'duplicado@example.com',
              senha: 'senha123',
              telefones: [{numero: '123456789', ddd: '11'}],
            });

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({mensagem: 'E-mail já existente'});
      });
});

describe('Sign In', () => {
  test('Deve autenticar o usuário e retornar um token JWT', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send({
          email: 'test@exampletest.com',
          password: 'password123',
        });
    token = response.body.token;
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('Não deve autenticar com e-mail inexistente', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send({email: 'naoexistente@example.com', password: 'senha123'});

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({mensagem: 'Usuário e/ou senha inválidos'});
  });

  test('Não deve autenticar com senha incorreta', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send({email: 'test@exampletest.com', password: 'wrongone'});

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({mensagem: 'Usuário e/ou senha inválidos'});
  });
});

describe('Recuperação de Informações do Usuário', () => {
  test('Deve retornar as informações do usuário', async () => {
    const response = await request(app)
        .get('/api/users/user')
        .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      nome: 'Teste',
      email: 'test@exampletest.com',
      telefones: [{numero: '123456789', ddd: '11'}],
      data_criacao: expect.any(String),
      data_atualizacao: expect.any(String),
      ultimo_login: expect.any(String),
    });
  });

  test('Não deve retornar informações do usuário com token inexistente',
      async () => {
        const tokenInvalido = '';
        const response = await request(app)
            .get('/api/users/user')
            .set('Authorization', `Bearer ${tokenInvalido}`);

        expect(response.statusCode).toBe(401);
        expect(response.body).toEqual({mensagem: 'Não autorizado'});
      });

  test('Não deve retornar informações do usuário com token inválido',
      async () => {
        const tokenInvalido = 'XXXXXXXXX';
        const response = await request(app)
            .get('/api/users/user')
            .set('Authorization', `Bearer ${tokenInvalido}`);

        expect(response.statusCode).toBe(403);
        expect(response.body).toEqual({mensagem: 'Sessão inválida'});
      });
});

describe('Endpoint Não Existente', () => {
  test('Deve retornar 404 para rotas não definidas', async () => {
    const response = await request(app)
        .get('/caminho/que/nao/existe');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({mensagem: 'Endpoint não encontrado'});
  });
});

afterAll(async () => {
  await sequelize.close();
});
