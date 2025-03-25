require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const feriasRoutes = require('./src/routes/feriasRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Middlewares
app.use(express.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/ferias', feriasRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Gerenciamento de Férias!' });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 