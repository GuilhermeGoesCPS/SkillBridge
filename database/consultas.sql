-- Execução manual: mysql --default-character-set=utf8mb4 -u <usuario> -p <nome_do_banco> < database/consultas.sql
-- Container MySQL (docker-entrypoint-initdb.d): renomeie com prefixo numérico
-- para rodar por último (ex.: 06-consultas.sql), pois o container executa os
-- arquivos em ordem alfabética. Requer schema.sql, inserts.sql, views.sql e
-- functions.sql já aplicados.

-- Vagas com os dados da empresa, pela view
SELECT * FROM vw_vagas_com_empresa ORDER BY id DESC;

-- Vagas com total de candidaturas recebidas
SELECT v.id, v.tipo, COUNT(c.id) AS total_candidaturas
FROM vagas v
LEFT JOIN candidaturas c ON c.vaga = v.id
GROUP BY v.id, v.tipo
ORDER BY total_candidaturas DESC;

-- Total de vagas publicadas por empresa
SELECT u.nome AS empresa, COUNT(v.id) AS total_vagas
FROM empresas e
JOIN usuarios u ON u.id = e.usuario
LEFT JOIN vagas v ON v.empresa = e.id
GROUP BY u.nome
ORDER BY total_vagas DESC;

-- Candidaturas de um aluno específico ainda sem decisão da empresa
SELECT * FROM vw_candidaturas_detalhadas WHERE aluno_id = 1 AND aceito IS NULL;

-- Alunos com mais candidaturas aceitas
SELECT u.nome AS aluno, COUNT(*) AS aceitas
FROM candidaturas c
JOIN alunos a ON a.id = c.aluno
JOIN usuarios u ON u.id = a.usuario
WHERE c.aceito = TRUE
GROUP BY u.nome
ORDER BY aceitas DESC;

-- Total de candidaturas por vaga, usando a function
SELECT id, tipo, fn_contar_candidaturas_vaga(id) AS total_candidaturas
FROM vagas;
