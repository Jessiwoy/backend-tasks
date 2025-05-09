# 📱 API do Desafio React Native – Backend com Firebase + Firestore

Backend criado para o desafio de React Native com autenticação via Firebase e banco de dados Firestore.

---

## 🔐 Autenticação

Todas as rotas (exceto testes locais) exigem autenticação via Firebase Authentication.

**Header obrigatório em todas as rotas protegidas:**

```
Authorization: Bearer <idToken>
```

Você pode obter esse token fazendo login com e-mail e senha na API REST do Firebase.

---

## 📚 Rotas da API

### 🔑 POST `/auth/register`

Registra um novo usuário.

#### 📥 Body:

```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Usuário Teste",
  "phone_number": "81912345678"
}
```

#### 🔎 Regras:

- Todos os campos são obrigatórios.
- O campo `phone_number` deve conter apenas números.

#### ✅ Resposta:

```json
{
  "uid": "abc123xyz",
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔑 POST `/auth/login`

Realiza o login de um usuário existente.

#### 📥 Body:

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

#### 🔎 Regras:

- Ambos os campos são obrigatórios.

#### ✅ Resposta:

```json
{
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "AEu4IL2..."
}
```

---

### 🔑 POST `/auth/refresh`

Renova o token de autenticação.

#### 📥 Body:

```json
{
  "refreshToken": "AEu4IL2..."
}
```

#### 🔎 Regras:

- O campo `refreshToken` é obrigatório.

#### ✅ Resposta:

```json
{
  "idToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "AEu4IL2...",
  "expiresIn": "3600"
}
```

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
  "phone_number": "81912345678",
  "picture": "avatar_2"
}
```

---

### ➕ PUT `/profile`

Atualiza o perfil do usuário autenticado.

#### 🔒 Protegida? Sim

#### 📥 Body:

```json
{
  "name": "João da Silva",
  "phone_number": "11912341234",
  "picture": "avatar_3"
}
```

#### 🔎 Regras:

- O campo `name` deve ser uma string não vazia.
- O campo `phone_number` deve conter apenas números.
- O campo `picture` deve ser um ID válido no formato `avatar_1`, `avatar_2`, ..., `avatar_5`.

#### ✅ Resposta:

```
200 OK
```

---

### ✅ GET `/tasks`

Retorna todas as tarefas do usuário autenticado, incluindo tarefas compartilhadas com ele.

#### 🔒 Protegida? Sim

#### ✅ Exemplo de resposta:

```json
[
  {
    "id": "123abc",
    "title": "Estudar React Native",
    "description": "Finalizar desafio",
    "deadline": "13/04/2025",
    "priority": 2,
    "done": false,
    "createdAt": "2025-04-13T14:20:00.000Z",
    "subtasks": [
      { "title": "Ler documentação", "done": true },
      { "title": "Codar exemplo", "done": false }
    ],
    "tags": ["estudo", "react-native"],
    "sharedWith": ["outro@email.com"]
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
  "done": false,
  "deadline": "15/04/2025",
  "priority": 3,
  "subtasks": [
    { "title": "Subtarefa 1", "done": false },
    { "title": "Subtarefa 2", "done": true }
  ],
  "tags": ["tag1", "tag2"]
}
```

#### 🔎 Regras:

- `title` é obrigatório e deve ser uma string não vazia.
- `description` é opcional.
- `deadline` é obrigatório e deve estar no formato `dd/mm/yyyy`.
- `priority` é opcional e deve ser um número entre 1 (alta) e 3 (baixa). O padrão é 3.
- `subtasks` é opcional. Se enviado, deve ser um array de objetos com `title` (string) e `done` (boolean).
- `tags` é opcional. Se enviado, deve ser um array de strings com no máximo 5 itens.

#### ✅ Resposta:

```json
{
  "id": "123abc"
}
```

---

### ✏️ PUT `/tasks/:id`

Atualiza uma tarefa existente (somente pelo criador).

#### 🔒 Protegida? Sim

#### 📥 Body (qualquer campo opcional):

```json
{
  "title": "Título atualizado",
  "description": "Nova descrição",
  "deadline": "20/04/2025",
  "priority": 1,
  "done": true,
  "subtasks": [
    { "title": "Item 1", "done": true },
    { "title": "Item 2", "done": false }
  ],
  "tags": ["tag1", "tag3"]
}
```

#### 🔎 Regras:

- `title`, se enviado, deve ser uma string não vazia.
- `description`, se enviado, é opcional.
- `deadline`, se enviado, deve estar no formato `dd/mm/yyyy`.
- `priority`, se enviado, deve ser um número entre 1 (alta) e 3 (baixa).
- `done`, se enviado, deve ser um booleano.
- `subtasks`, se enviado, deve ser um array de objetos com `title` (string) e `done` (boolean).
- `tags`, se enviado, deve ser um array de strings com no máximo 5 itens.
- Apenas o criador da tarefa (`uid`) pode atualizá-la.

#### ✅ Resposta:

```
200 OK
```

---

### 🔗 PUT `/tasks/:id/share`

Compartilha a tarefa com outros usuários informando seus e-mails.

#### 🔒 Protegida? Sim

#### 📥 Body:

```json
{
  "sharedWith": ["email1@exemplo.com", "email2@exemplo.com"]
}
```

#### 🔎 Regras:

- Apenas o criador da tarefa pode compartilhá-la.
- A lista deve conter e-mails válidos em formato de string.
- Caso algum e-mail não exista no banco de dados, a resposta incluirá os e-mails inválidos.

#### ✅ Exemplo de resposta (em caso de erro):

```json
{
  "error": "Os seguintes e-mails não existem na base de dados",
  "invalidEmails": ["email_invalido@exemplo.com"]
}
```

---

### 🔗 GET `/users/search`

Busca usuários pelo e-mail.

#### 🔒 Protegida? Sim

#### 📥 Query Params:

```json
{
  "query": "parte_do_email"
}
```

#### 🔎 Regras:

- O campo `query` deve ser uma string não vazia.
- Retorna no máximo 10 resultados.

#### ✅ Exemplo de resposta:

```json
[
  {
    "email": "usuario@email.com",
    "picture": "avatar_1",
    "name": "Usuário Teste"
  }
]
```

---

### 💬 Comentários – `/comments`

#### 🔸 POST `/comments`

Adiciona um comentário a uma tarefa específica.

##### 🔒 Protegida? Sim

##### 📥 Body:

```json
{
  "taskId": "abc123",
  "content": "Ótimo progresso!"
}
```

##### 🔎 Regras:

- `taskId` deve ser o ID de uma tarefa existente.
- `content` deve ser uma string não vazia.

##### ✅ Resposta:

```
201 Created
```

---

#### 🔸 GET `/comments/:taskId`

Lista os comentários de uma tarefa.

##### 🔒 Protegida? Sim

##### ✅ Exemplo de resposta:

```json
[
  {
    "id": "comment123",
    "author": "usuario@exemplo.com",
    "content": "Boa ideia!",
    "createdAt": "2025-04-14T12:34:56.789Z"
  }
]
```

---

### ❌ DELETE `/tasks/:id`

Remove uma tarefa do usuário (somente pelo criador).

#### 🔒 Protegida? Sim

#### ✅ Resposta:

```
200 OK
```

---

### ❌ DELETE `/profile/delete-account`

Remove a conta do usuário autenticado.

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
- DOCKER

---

## 🚀 Deploy sugerido

- Subir este backend em uma instância EC2 da AWS
- Utilizar `docker` para manter o servidor rodando
- Configurar porta (ex: 3000) e liberar via Security Group

---

## 👨‍🏫 Projeto para alunos

O app React Native deverá:

- Fazer login com Firebase Auth.
- Escolher um dos 5 avatares disponíveis.
- Criar, editar e deletar tarefas.
- Compartilhar tarefas com colegas pelo e-mail.
- Comentar em tarefas.
- Listar tarefas com subtarefas (checklist).
- Exibir o avatar e nome do usuário no perfil.

---

📘 Desafio proposto por: **Gabriel Santos**
