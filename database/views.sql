-- Execução manual: mysql --default-character-set=utf8mb4 -u <usuario> -p <nome_do_banco> < database/views.sql
-- Container MySQL (docker-entrypoint-initdb.d): renomeie com prefixo numérico
-- para rodar depois de schema.sql e inserts.sql (ex.: 03-views.sql), pois o
-- container executa os arquivos em ordem alfabética.

CREATE OR REPLACE VIEW vw_vagas_com_empresa AS
SELECT
    v.id,
    v.tipo,
    v.descricao,
    v.salario,
    v.horario_inicio,
    v.horario_termino,
    v.numero_de_vagas,
    e.id AS empresa_id,
    u.nome AS empresa_nome
FROM vagas v
JOIN empresas e ON e.id = v.empresa
JOIN usuarios u ON u.id = e.usuario;

CREATE OR REPLACE VIEW vw_candidaturas_detalhadas AS
SELECT
    c.id AS candidatura_id,
    c.aceito,
    a.id AS aluno_id,
    ua.nome AS aluno_nome,
    v.id AS vaga_id,
    v.tipo AS vaga_tipo,
    ue.nome AS empresa_nome
FROM candidaturas c
JOIN alunos a ON a.id = c.aluno
JOIN usuarios ua ON ua.id = a.usuario
JOIN vagas v ON v.id = c.vaga
JOIN empresas e ON e.id = v.empresa
JOIN usuarios ue ON ue.id = e.usuario;
