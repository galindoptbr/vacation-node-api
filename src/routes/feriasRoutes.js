const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const feriasController = require('../controllers/feriasController');

// Todas as rotas de férias requerem autenticação
router.use(authMiddleware);

// Rotas para todos os usuários
router.post('/', feriasController.create);
router.get('/minhas', feriasController.listMinhas);
router.delete('/:id', feriasController.deleteFerias);

// Rotas que requerem admin
router.get('/admin', feriasController.listAll); // Lista todas as solicitações (admin)
router.patch('/:id/status', feriasController.updateStatus);
router.delete('/admin/:id', feriasController.deleteAdmin);

module.exports = router; 