# 📱 API do Desafio React Native – Backend com Firebase + Firestore

Backend criado para o desafio de React Native com autenticação via Firebase e banco de dados Firestore.

---

## 🔐 Autenticação

Todas as rotas exigem autenticação via Firebase Authentication.

**Header obrigatório em todas as rotas protegidas:**

```
Authorization: Bearer <idToken>
```

Você pode obter esse token fazendo login com e-mail e senha na API REST do Firebase.

---

## 📚 Rotas da API

---

### 👤 GET `/profile`

Retorna os dados do usuário autenticado.

#### 🔒 Protegida? Sim

#### ✅ Resposta:

```json
{
  "uid": "abc123xyz",
  "email": "usuario@email.com",
  "name": "Usuário Teste",
  "picture": "avatar_2"
}
```

---

### 👤 PUT `/profile/avatar`

Atualiza o avatar do usuário autenticado.

#### 🔒 Protegida? Sim

#### 📥 Body:

```json
{
  "picture": "avatar_3"
}
```

#### 🔎 Regras:

- O campo `picture` deve ser um ID válido no formato `avatar_1`, `avatar_2`, ..., `avatar_5`
- O aplicativo deve tratar o ID e renderizar a imagem correspondente

#### ✅ Resposta:

```
200 OK
```

---

### ✅ GET `/tasks`

Retorna todas as tarefas do usuário autenticado.

#### 🔒 Protegida? Sim

#### ✅ Exemplo de resposta:

```json
[
  {
    "id": "123abc",
    "title": "Estudar React Native",
    "description": "Finalizar desafio",
    "done": false,
    "createdAt": "2025-04-13T14:20:00.000Z"
  }
]
```

---

### ➕ POST `/tasks`

Cria uma nova tarefa.

#### 🔒 Protegida? Sim

#### 📥 Body:

```json
{
  "title": "Nova tarefa",
  "description": "Descrição opcional",
  "done": false
}
```

#### ✅ Resposta:

```
201 Created
```

---

### ✏️ PUT `/tasks/:id`

Atualiza uma tarefa existente.

#### 🔒 Protegida? Sim

#### 📥 Body (qualquer campo opcional):

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "done": true
}
```

#### ✅ Resposta:

```
200 OK
```

#### ⚠️ Importante:

- Se o `id` não existir, retorna erro `404`.

---

### ❌ DELETE `/tasks/:id`

Remove uma tarefa do usuário.

#### 🔒 Protegida? Sim

#### ✅ Resposta:

```
200 OK
```

---

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- Firebase Admin SDK
- Firestore
- JWT (via Firebase Auth)
- PM2 (para produção)

---

## 🚀 Deploy sugerido

- Subir este backend em uma instância EC2 da AWS
- Utilizar `pm2` para manter o servidor rodando
- Configurar porta (ex: 3000) e liberar via Security Group

---

## 👨‍🏫 Projeto para alunos

O app React Native deverá:

- Fazer login com Firebase Auth
- Escolher um dos 5 avatares disponíveis
- Criar, editar e deletar tarefas
- Listar tarefas
- Exibir o avatar e nome do usuário no perfil

---

📘 Desafio proposto por: **Professor de React Native**
