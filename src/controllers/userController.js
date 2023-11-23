const User = require('../models/user');
const bcrypt = require('bcrypt');

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
    }
};

module.exports = userController;
