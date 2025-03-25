const mongoose = require('mongoose');

const feriasSchema = new mongoose.Schema({
  funcionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dataInicio: {
    type: Date,
    required: true
  },
  dataFim: {
    type: Date,
    required: true
  },
  motivo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'rejeitado'],
    default: 'pendente'
  },
  observacoes: {
    type: String
  }
}, {
  timestamps: true
});

// Validação para garantir que a data de fim seja posterior à data de início
feriasSchema.pre('save', function(next) {
  if (this.dataFim <= this.dataInicio) {
    next(new Error('A data de fim deve ser posterior à data de início'));
  }
  next();
});

module.exports = mongoose.model('Ferias', feriasSchema); 