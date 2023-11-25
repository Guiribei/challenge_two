const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const userController = {
  // Cadastro de usuário
  async signUp(req, res) {
    try {
      const {nome, email, senha, telefones} = req.body;

      // Verificar se o e-mail já está cadastrado
      const existingUser = await User.findOne({where: {email}});
      if (existingUser) {
        return res.status(400).json({mensagem: 'E-mail já existente'});
      }

      // Criptografar a senha antes de salvar
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Criar novo usuário
      const user = await User.create({
        nome,
        email,
        password: hashedPassword,
        telefones,
      });

      // Gerar o token JWT
      const token = jwt.sign(
          {id: user.id},
          jwtSecret,
          {expiresIn: '30m'}, // Opção para expirar em 30 minutos
      );

      res.status(201).json({
        id: user.id,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
        ultimo_login: new Date(),
        token: token,
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      res.status(500).json({mensagem: 'Erro ao cadastrar usuário'});
    }
  },
  async signIn(req, res) {
    try {
      const {email, senha} = req.body;

      const user = await User.findOne({where: {email}});
      if (!user) {
        return res.status(401).json({mensagem: 'Usuário e/ou senha inválidos'});
      }

      const isMatch = await bcrypt.compare(senha, user.password);
      if (!isMatch) {
        return res.status(401).json({mensagem: 'Usuário e/ou senha inválidos'});
      }

      user.ultimo_login = new Date();
      await user.save();

      const token = jwt.sign(
          {id: user.id},
          jwtSecret,
          {expiresIn: '30m'},
      );

      res.json({
        id: user.id,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
        ultimo_login: user.ultimo_login,
        token: token,
      });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({mensagem: 'Erro interno do servidor'});
    }
  },
  async getUser(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'nome', 'email', 'telefones',
          'createdAt', 'updatedAt', 'ultimo_login'],
      });
      if (!user) {
        return res.status(404).json({mensagem: 'User não encontrado'});
      }

      res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefones: user.telefones,
        data_criacao: user.createdAt,
        data_atualizacao: user.updatedAt,
        ultimo_login: user.ultimo_login,
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({mensagem: 'Erro interno do servidor'});
    }
  },
};

module.exports = userController;
