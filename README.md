# Vacation Management API

API REST para gerenciamento de férias de funcionários.

## Tecnologias

- Node.js
- Express
- MongoDB
- JWT para autenticação

## Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/galindoptbr/vacation-node-api.git
cd vacation-node-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ferias-api
JWT_SECRET=400270596b02bb71fd2ef03ac953857522aef7d47457b886afb388215997423e0709ccaad8726d2a0db0e01175dd771f1eee6080d01f4d4df576955a2ae0044c
```

4. Inicie o servidor:
```bash
npm run dev
```

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/users` - Lista usuários (requer autenticação)

### Férias
- `POST /api/ferias` - Solicitar férias
- `GET /api/ferias/minhas` - Listar próprias férias
- `GET /api/ferias/admin` - Listar todas as férias (admin)

## Exemplo de Uso

1. Registre um usuário:
```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "123456",
  "cargo": "Desenvolvedor",
  "isAdmin": true
}'
```

2. Faça login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "joao@exemplo.com",
  "senha": "123456"
}'
```

3. Use o token retornado para acessar rotas protegidas:
```bash
curl -X GET http://localhost:3000/api/ferias/minhas \
-H "Authorization: Bearer seu-token-jwt"
```

## Testes

```bash
npm test
``` 