const Ferias = require('../models/Ferias');

// Criar uma nova solicitação de férias
const create = async (req, res) => {
  try {
    const { dataInicio, dataFim, motivo } = req.body;
    
    const ferias = await Ferias.create({
      funcionario: req.user._id,
      dataInicio,
      dataFim,
      motivo,
      status: 'pendente'
    });

    await ferias.populate('funcionario', '-senha');

    return res.status(201).json(ferias);
  } catch (error) {
    console.error('Erro ao criar solicitação de férias:', error);
    return res.status(500).json({ message: 'Erro ao criar solicitação de férias' });
  }
};

// Listar solicitações de férias do usuário logado
const listMinhas = async (req, res) => {
  try {
    const ferias = await Ferias.find({ funcionario: req.user._id })
      .populate('funcionario', '-senha')
      .sort('-createdAt');

    return res.json(ferias);
  } catch (error) {
    console.error('Erro ao listar férias:', error);
    return res.status(500).json({ message: 'Erro ao listar férias' });
  }
};

// Listar todas as solicitações de férias (admin)
const listAll = async (req, res) => {
  try {
    // Verifica se o usuário é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const ferias = await Ferias.find()
      .populate('funcionario', '-senha')
      .sort('-createdAt');

    return res.json(ferias);
  } catch (error) {
    console.error('Erro ao listar férias:', error);
    return res.status(500).json({ message: 'Erro ao listar férias' });
  }
};

// Atualizar status da solicitação de férias (admin)
const updateStatus = async (req, res) => {
  try {
    // Verifica se o usuário é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['aprovado', 'rejeitado'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const ferias = await Ferias.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('funcionario', '-senha');

    if (!ferias) {
      return res.status(404).json({ message: 'Solicitação de férias não encontrada' });
    }

    return res.json(ferias);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return res.status(500).json({ message: 'Erro ao atualizar status' });
  }
};

// Excluir uma solicitação de férias (apenas se estiver pendente e pertencer ao usuário)
const deleteFerias = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Busca a solicitação de férias
    const ferias = await Ferias.findById(id);
    
    // Verifica se a solicitação existe
    if (!ferias) {
      return res.status(404).json({ message: 'Solicitação de férias não encontrada' });
    }

    // Verifica se a solicitação pertence ao usuário logado
    if (ferias.funcionario.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir esta solicitação' });
    }

    // Verifica se a solicitação está pendente
    if (ferias.status !== 'pendente') {
      return res.status(400).json({ message: 'Apenas solicitações pendentes podem ser excluídas' });
    }

    // Exclui a solicitação
    await Ferias.findByIdAndDelete(id);

    return res.json({ message: 'Solicitação de férias excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir solicitação de férias:', error);
    return res.status(500).json({ message: 'Erro ao excluir solicitação de férias' });
  }
};

// Excluir qualquer solicitação de férias (apenas admin)
const deleteAdmin = async (req, res) => {
  try {
    // Verifica se o usuário é admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { id } = req.params;
    
    // Busca a solicitação de férias
    const ferias = await Ferias.findById(id);
    
    // Verifica se a solicitação existe
    if (!ferias) {
      return res.status(404).json({ message: 'Solicitação de férias não encontrada' });
    }

    // Exclui a solicitação
    await Ferias.findByIdAndDelete(id);

    return res.json({ 
      message: 'Solicitação de férias excluída com sucesso',
      deletedFerias: ferias
    });
  } catch (error) {
    console.error('Erro ao excluir solicitação de férias:', error);
    return res.status(500).json({ message: 'Erro ao excluir solicitação de férias' });
  }
};

module.exports = {
  create,
  listMinhas,
  listAll,
  updateStatus,
  deleteFerias,
  deleteAdmin
}; 