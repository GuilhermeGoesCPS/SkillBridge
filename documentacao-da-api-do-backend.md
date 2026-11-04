# API do SkillBridge

Esta documentação descreve os endpoints da API REST do SkillBridge, seus parâmetros, regras de acesso e respostas esperadas.

Os endpoints públicos, de cadastro/login e protegidos descritos abaixo estão implementados no backend.

## Convenções

- Os caminhos usam o prefixo `/api` e os corpos das requisições e respostas usam JSON.
- `{id}` representa o identificador do recurso indicado no caminho.
- Os endpoints públicos não exigem autenticação. Cadastro e login também são públicos.
- Os endpoints protegidos exigem um token de acesso no cabeçalho `Authorization`.

```http
Authorization: Bearer <token>
```

O token deve identificar o usuário autenticado, seu tipo de conta (`aluno`, `empresa` ou `instituicao`) e tem validade de uma hora. As permissões de cada endpoint protegido são verificadas a partir do token.

## Endpoints públicos implementados

### Informações da API

#### `GET /api`

Retorna informações técnicas, como nome, versão e endpoints disponíveis.

### Vagas

#### `GET /api/vagas`

Retorna todas as vagas cadastradas.

#### `GET /api/vagas/{id}`

Retorna os detalhes da vaga identificada por `{id}`.

#### `GET /api/vagas?tags=1,2,3`

Filtra vagas por um ou mais IDs de tag separados por vírgula. São retornadas vagas associadas a pelo menos uma das tags informadas.

### Tags e categorias

#### `GET /api/tags`

Retorna todas as tags cadastradas.

#### `GET /api/tags?categorias=1,2,3`

Filtra tags por um ou mais IDs de categoria separados por vírgula. São retornadas tags associadas a pelo menos uma das categorias informadas.

#### `GET /api/categorias`

Retorna todas as categorias cadastradas.

#### `GET /api/cursos`

Retorna os cursos disponíveis para selecionar durante o cadastro de aluno.

### Empresas e instituições

#### `GET /api/empresas`

Retorna as empresas cadastradas.

#### `GET /api/empresas/{id}`

Retorna os dados da empresa identificada por `{id}`.

#### `GET /api/instituicoes`

Retorna as instituições cadastradas.

#### `GET /api/instituicoes/{id}`

Retorna os dados da instituição identificada por `{id}`.

### Alunos

#### `GET /api/alunos?tags=1,2,3`

Retorna alunos associados a pelo menos uma das tags informadas. A busca exige um ou mais IDs de tag separados por vírgula.

## Cadastro e login

Cadastro e login não exigem token. Cada rota de login aceita somente contas do tipo indicado no caminho.

### `POST /api/cadastro/aluno`

Cria uma conta de aluno e seu perfil. O cadastro recebe os dados do usuário e os campos específicos do aluno:

```json
{
  "nome": "Ana Silva",
  "email": "ana@example.com",
  "senha": "senha-forte",
  "endereco": "Rua Exemplo, 123",
  "descricao": "Estudante de desenvolvimento",
  "contato": "ana@example.com",
  "ra": "2026000000001",
  "periodo": "m",
  "cursoId": 1,
  "instituicaoId": 1
}
```

O campo `periodo` aceita `m` (manhã), `t` (tarde) ou `n` (noite).

Resposta: `201 Created`, com os dados públicos da conta. A senha não é incluída.

### `POST /api/cadastro/empresa`

Cria uma conta de empresa e seu perfil:

```json
{
  "nome": "Empresa Exemplo",
  "email": "contato@empresa.example",
  "senha": "senha-forte",
  "endereco": "Rua Exemplo, 456",
  "descricao": "Descrição da empresa",
  "contato": "(11) 99999-0000",
  "cnpj": "12345678000199"
}
```

Resposta: `201 Created`, com os dados públicos da conta. A senha não é incluída.

### `POST /api/cadastro/instituicao`

Cria uma conta de instituição e seu perfil:

```json
{
  "nome": "Instituição Exemplo",
  "email": "contato@instituicao.example",
  "senha": "senha-forte",
  "endereco": "Rua Exemplo, 789",
  "descricao": "Instituição de ensino",
  "contato": "(11) 98888-0000",
  "cnpj": "98765432000199"
}
```

Resposta: `201 Created`, com os dados públicos da conta. A senha não é incluída.

### Login

Rotas disponíveis: `POST /api/login/aluno`, `POST /api/login/empresa` e `POST /api/login/instituicao`.

Cada rota autentica uma conta do tipo indicado no caminho. Todas recebem:

```json
{
  "email": "ana@example.com",
  "senha": "senha-forte"
}
```

Resposta: `200 OK`. O exemplo abaixo mostra o retorno para uma conta de aluno; o campo `tipo` corresponde ao tipo autenticado.

```json
{
  "accessToken": "<token>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "usuario": {
    "id": 1,
    "nome": "Ana Silva",
    "tipo": "aluno"
  }
}
```

Credenciais inválidas ou incompatíveis com o tipo de conta retornam `401 Unauthorized`.

## Endpoints protegidos

Todos os endpoints desta seção exigem o cabeçalho `Authorization: Bearer <token>`.

### Conta do usuário

#### `GET /api/usuario`

Retorna os dados da conta autenticada e de seu perfil. O usuário é identificado pelo token; não é necessário enviar seu ID. A resposta nunca inclui senha ou hash de senha.

Resposta: `200 OK`.

#### `PATCH /api/usuario`

Atualiza os dados da conta autenticada. Envie apenas os campos que deseja alterar, como `nome`, `email`, `endereco`, `descricao` e `contato`, além dos campos editáveis do próprio perfil. Campos de outro tipo de perfil não são aceitos.

Resposta: `200 OK`, com os dados atualizados e sem senha ou hash de senha.

### Vagas

#### `POST /api/vagas`

Cria uma vaga associada à empresa autenticada. Permitido somente para contas do tipo `empresa`; não envie o ID da empresa no corpo.

```json
{
  "tipo": "Estágio",
  "descricao": "Desenvolvimento de aplicações web",
  "salario": 1500.00,
  "horarioInicio": "09:00:00",
  "horarioTermino": "15:00:00",
  "numeroDeVagas": 2,
  "tags": [1, 3]
}
```

Resposta: `201 Created`, com a vaga criada e associada à empresa autenticada.

#### `PATCH /api/vagas/{id}`

Atualiza a vaga identificada por `{id}`. Permitido somente para a empresa proprietária da vaga. Envie apenas os campos que deseja alterar, entre `tipo`, `descricao`, `salario`, `horarioInicio`, `horarioTermino`, `numeroDeVagas` e `tags`. Ao enviar `tags`, a lista substitui por completo as tags associadas à vaga (envie `[]` para remover todas).

```json
{
  "salario": 1600.00,
  "horarioTermino": "16:00:00"
}
```

Resposta: `200 OK`, com a vaga atualizada no mesmo formato de `GET /api/vagas/{id}`. Um corpo sem nenhum campo retorna `400 Bad Request`; um horário de término anterior ou igual ao de início (considerando o valor já salvo quando apenas um dos dois é enviado) também retorna `400 Bad Request`. Uma vaga inexistente retorna `404 Not Found`; uma vaga de outra empresa retorna `403 Forbidden`.

#### `DELETE /api/vagas/{id}`

Remove a vaga identificada por `{id}`, junto com suas tags e candidaturas associadas. Permitido somente para a empresa proprietária da vaga.

Resposta: `200 OK`, com `{ "id": <id da vaga removida> }`. Uma vaga inexistente retorna `404 Not Found`; uma vaga de outra empresa retorna `403 Forbidden`.

### Candidaturas

#### `POST /api/candidatar/{id}`

Candidata o aluno autenticado à vaga identificada por `{id}`. Permitido somente para contas do tipo `aluno`. Não recebe corpo: a identidade do aluno é obtida pelo token.

Resposta: `201 Created`, com a confirmação e os IDs da candidatura e da vaga. Se o aluno já estiver inscrito nessa vaga, retorna `409 Conflict`.

#### `GET /api/minhas-candidaturas`

Retorna as candidaturas do aluno autenticado, com os dados básicos de cada vaga e da empresa. Permitido somente para contas do tipo `aluno`. Não recebe parâmetros: a identidade do aluno é obtida pelo token.

Resposta: `200 OK`.

```json
[
  {
    "id": 1,
    "aceito": null,
    "vaga": { "id": 1, "tipo": "Estágio", "salario": 1200.00, "horarioInicio": "13:00:00", "horarioTermino": "18:00:00" },
    "empresa": { "id": 1, "nome": "SkillBridge Tecnologia Ltda" }
  }
]
```

O campo `aceito` é `null` enquanto a empresa não decidiu, `true` se aceita ou `false` se recusada. Os campos `vaga` e `empresa` podem chegar como texto JSON (mesmo comportamento de outros campos compostos da API) e devem ser decodificados pelo cliente quando necessário.

#### `GET /api/candidaturas/{id}`

Retorna os IDs dos alunos que se candidataram à vaga identificada por `{id}`, e os dados de cada candidatura. Permitido somente para contas do tipo `empresa` e para a empresa proprietária da vaga.

Resposta: `200 OK`. Cada item de `candidaturas` inclui também o campo `aluno`, com os dados básicos do estudante candidato (sem senha, hash, RA ou email).

```json
{
  "vagaId": 12,
  "alunosIds": [4, 7, 9],
  "candidaturas": [
    {
      "id": 101, "alunoId": 4, "aceito": null,
      "aluno": {
        "id": 4, "nome": "Ana Silva",
        "curso": { "id": 1, "nome": "Análise e Desenvolvimento de Sistemas" },
        "periodo": "m",
        "instituicao": { "id": 2, "nome": "Fatec Diadema" },
        "contato": "ana@example.com"
      }
    },
    {
      "id": 102, "alunoId": 7, "aceito": true,
      "aluno": {
        "id": 7, "nome": "Carlos Souza",
        "curso": { "id": 1, "nome": "Análise e Desenvolvimento de Sistemas" },
        "periodo": "t",
        "instituicao": { "id": 2, "nome": "Fatec Diadema" },
        "contato": "carlos@example.com"
      }
    },
    {
      "id": 103, "alunoId": 9, "aceito": false,
      "aluno": {
        "id": 9, "nome": "Bruno Costa",
        "curso": { "id": 3, "nome": "Banco de Dados" },
        "periodo": "n",
        "instituicao": { "id": 3, "nome": "Fatec Outra" },
        "contato": "bruno@example.com"
      }
    }
  ]
}
```

Se não houver candidaturas, `alunosIds` e `candidaturas` serão listas vazias. Uma vaga inexistente retorna `404 Not Found`; uma tentativa de consultar vaga de outra empresa retorna `403 Forbidden`.

#### `PATCH /api/candidaturas/{candidaturaId}/status`

Aceita ou recusa a candidatura identificada por `{candidaturaId}`, usando o `id` retornado em `candidaturas` por `GET /api/candidaturas/{id}`. Permitido somente para a empresa proprietária da vaga da candidatura.

```json
{
  "aceito": true
}
```

Resposta: `200 OK`, com `{ "id", "vagaId", "alunoId", "aceito" }`. Uma candidatura inexistente retorna `404 Not Found`; uma candidatura de uma vaga de outra empresa retorna `403 Forbidden`.

### Instituição

As rotas a seguir usam a instituição identificada pelo token; não é possível informar outra instituição por parâmetro, e uma instituição nunca vê alunos ou candidaturas de outra.

#### `GET /api/instituicao/alunos`

Retorna os alunos vinculados à instituição autenticada. Permitido somente para contas do tipo `instituicao`.

Filtro opcional `?curso=1,2` por um ou mais IDs de curso separados por vírgula.

Resposta: `200 OK`.

```json
[
  {
    "id": 4, "nome": "Ana Silva", "ra": "2026000000011", "periodo": "m",
    "contato": "ana@example.com",
    "curso": { "id": 1, "nome": "Análise e Desenvolvimento de Sistemas" }
  }
]
```

#### `GET /api/instituicao/candidaturas`

Retorna as candidaturas aceitas (`aceito = true`) de alunos da instituição autenticada, com os dados do aluno, da vaga e da empresa. Permitido somente para contas do tipo `instituicao`.

Resposta: `200 OK`.

```json
[
  {
    "id": 101, "aceito": true,
    "aluno": { "id": 4, "nome": "Ana Silva", "ra": "2026000000011", "periodo": "m" },
    "vaga": { "id": 12, "tipo": "Estágio", "salario": 1500.00, "horarioInicio": "09:00:00", "horarioTermino": "15:00:00" },
    "empresa": { "id": 1, "nome": "Empresa Exemplo" }
  }
]
```

Se não houver candidaturas aceitas, a resposta é uma lista vazia.

## Códigos de resposta

Os códigos abaixo descrevem as respostas da API.

- `400 Bad Request`: corpo, parâmetro ou filtro inválido; ou campo obrigatório ausente.
- `401 Unauthorized`: token ausente, inválido ou expirado, ou credenciais de login inválidas.
- `403 Forbidden`: usuário autenticado sem permissão para a operação ou para o recurso.
- `404 Not Found`: recurso solicitado não encontrado.
- `409 Conflict`: email, CNPJ ou RA já cadastrado, ou aluno já candidatado à vaga.