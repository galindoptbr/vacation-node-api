const express = require('express');
const router = express.Router();
const { register, login, promoteToAdmin, listUsers, deleteUser } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas (requer autenticação)
router.use(authMiddleware);
router.get('/users', listUsers);
router.patch('/promote/:userId', promoteToAdmin);
router.delete('/delete/:userId', deleteUser);

module.exports = router; 