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

3. Inicie o servidor:
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