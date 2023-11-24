const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const userController = {
	// Cadastro de usuário
	async signUp(req, res) {
		try {
			const { email, password } = req.body;

			// Verificar se o e-mail já está cadastrado
			const existingUser = await User.findOne({ where: { email } });
			if (existingUser) {
				return res.status(400).json({ mensagem: "E-mail já existente" });
			}

			// Criptografar a senha antes de salvar
			const hashedPassword = await bcrypt.hash(password, 10);

			// Criar novo usuário
			const user = await User.create({ email, password: hashedPassword });
			res.status(201).json({ id: user.id, email: user.email });
		} catch (error) {
			console.error('Erro detalhado:', error);
			res.status(500).json({ mensagem: "Erro ao cadastrar usuário" });
		}
	},
	async signIn(req, res) {
		try {
			const { email, password } = req.body;

			// Verificar se o e-mail está cadastrado
			const user = await User.findOne({ where: { email } });
			if (!user) {
				return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" });
			}

			// Comparar a senha fornecida com a hash salva
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(401).json({ mensagem: "Usuário e/ou senha inválidos" });
			}

			// Gerar o token JWT
			const token = jwt.sign(
				{ id: user.id }, // Payload
				jwtSecret,       // Segredo
				{ expiresIn: '30m' } // Opção para expirar em 30 minutos
			);

			res.json({ token });
		} catch (error) {
			console.error('Erro ao autenticar usuário:', error);
			res.status(500).json({ mensagem: "Erro ao autenticar usuário" });
		}
	},
	async getUser(req, res) {
		try {
			const user = await User.findByPk(req.user.id);
			if (!user) return res.status(404).json({ mensagem: "Usuário não encontrado" });
			res.json({ email: user.email, id: user.id });
		} catch (error) {
			console.error('Erro ao buscar usuário:', error);
			res.status(500).json({ mensagem: "Erro interno do servidor" });
		}
	}	
};

module.exports = userController;
