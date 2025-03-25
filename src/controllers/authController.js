const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      isAdmin: user.isAdmin 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { nome, email, senha, cargo, isAdmin } = req.body;
    console.log('Dados do registro:', { nome, email, cargo, isAdmin });

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Cria o usuário com o status de admin definido no corpo da requisição
    const user = await User.create({
      nome,
      email,
      senha, // A senha será hasheada pelo middleware do modelo
      cargo,
      isAdmin: isAdmin || false // Usa o valor do corpo da requisição ou false como padrão
    });

    console.log('Usuário criado:', { 
      id: user._id, 
      email: user.email, 
      isAdmin: user.isAdmin 
    });

    // Remove a senha do objeto de resposta
    const userResponse = user.toObject();
    delete userResponse.senha;

    // Gera o token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log('Tentativa de login:', { email });

    // Busca o usuário
    const user = await User.findOne({ email }).select('+senha');
    if (!user) {
      console.log('Usuário não encontrado:', { email });
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    console.log('Usuário encontrado:', { 
      id: user._id, 
      email: user.email, 
      isAdmin: user.isAdmin,
      senhaHash: user.senha.substring(0, 10) + '...' // Mostra apenas parte do hash para debug
    });

    // Verifica a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      console.log('Senha inválida para o usuário:', { email });
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    console.log('Login bem-sucedido:', {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    });

    // Remove a senha do objeto de resposta
    const userResponse = user.toObject();
    delete userResponse.senha;

    // Gera o token
    const token = generateToken(user);

    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verifica se o usuário que está fazendo a requisição é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário deletado:', {
      id: user._id,
      email: user.email
    });

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verifica se o usuário que está fazendo a requisição é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    // Atualiza o usuário para admin
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário promovido a admin:', {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    });

    res.json(user);
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    res.status(500).json({ message: 'Erro ao promover usuário' });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

module.exports = {
  register,
  login,
  promoteToAdmin,
  listUsers,
  deleteUser
}; 