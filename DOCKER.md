# SkillBridge com Docker

Sobe o banco de dados, o backend e o frontend com um único comando. Não é preciso ter Node ou MySQL instalados na máquina, só Docker (ou Podman).

## Pré-requisitos

- Docker Desktop (Windows/Mac) ou Docker Engine + Docker Compose (Linux), **ou** Podman + podman-compose (Linux).
- Portas livres: `3000` (backend), `3307` (MySQL), `5173` (frontend). O MySQL do host, se houver, continua na `3306` e não é afetado.

## Configurar as variáveis

1. Copie `.env.example` para `.env` na raiz do repositório.
2. Preencha `MYSQL_ROOT_PASSWORD` e `JWT_SECRET` com valores próprios (o `JWT_SECRET` deve ter pelo menos 32 caracteres).

O arquivo `.env` não deve ser versionado (já está no `.gitignore`).

## Subir tudo

```bash
docker compose up -d --build
```

No Linux com Podman, use `podman compose up -d --build` ou `podman-compose up -d --build` no lugar de `docker compose`.

## Acompanhar os logs

```bash
docker compose logs -f
```

## Testar

- API: `curl http://localhost:3000/api/vagas`
- Frontend: abra `http://localhost:5173` no navegador.

## Parar

```bash
docker compose down
```

## Apagar tudo e recomeçar do zero

```bash
docker compose down -v
```

Isso remove também o volume do banco de dados. Na próxima subida, os scripts de `database/` serão executados novamente.

## Observações importantes

- A carga dos scripts de `database/` (schema, inserts, views, functions, procedures) só acontece **na primeira vez** que o volume de dados do MySQL é criado. Se o banco já existir, os scripts não são executados novamente — use `docker compose down -v` para forçar uma carga limpa.
- A URL da API (`VITE_API_URL`) é gravada dentro dos arquivos estáticos do frontend **durante o build**. Se precisar mudar essa URL, exporte a variável antes de subir (por exemplo `VITE_API_URL=http://192.168.0.10:3000/api`) e rode novamente com `--build`:

  ```bash
  VITE_API_URL=http://192.168.0.10:3000/api docker compose up -d --build
  ```

## Windows (PowerShell)

```powershell
Copy-Item .env.example .env
notepad .env   # preencha as duas variáveis e salve
docker compose up -d --build
docker compose logs -f
docker compose down
docker compose down -v   # para recomeçar do zero
```

## Linux / Podman

```bash
cp .env.example .env
$EDITOR .env   # preencha as duas variáveis e salve

podman compose up -d --build
# ou, se não tiver o subcomando "compose":
podman-compose up -d --build

podman compose logs -f
podman compose down
podman compose down -v   # para recomeçar do zero
```
