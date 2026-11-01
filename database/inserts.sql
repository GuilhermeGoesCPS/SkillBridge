-- Execução manual: mysql --default-character-set=utf8mb4 -u <usuario> -p <nome_do_banco> < database/inserts.sql
-- Container MySQL (docker-entrypoint-initdb.d): renomeie com prefixo numérico
-- para rodar depois de schema.sql (ex.: 02-inserts.sql), pois o container
-- executa os arquivos em ordem alfabética.
--
-- Senha de desenvolvimento dos 3 usuários de exemplo (instituição, empresa e
-- aluno): "SkillBridgeDev#2026". Não é uma senha real, serve apenas para testar
-- login localmente. Os hashes abaixo foram gerados com o mesmo algoritmo do
-- backend (PBKDF2-SHA512, 310000 iterações, salt de 16 bytes + chave de 64
-- bytes), cada um com um salt diferente.

-- Cursos
INSERT INTO cursos (nome) VALUES
    ('Análise e Desenvolvimento de Sistemas'),
    ('Gestão da Tecnologia da Informação'),
    ('Banco de Dados'),
    ('Jogos Digitais');

-- Categorias de tags
INSERT INTO categorias (nome) VALUES
    ('Desenvolvimento'),
    ('Design'),
    ('Dados'),
    ('Suporte');

-- Tags
INSERT INTO tags (nome) VALUES
    ('JavaScript'),
    ('React'),
    ('Node.js'),
    ('Python'),
    ('SQL'),
    ('Figma'),
    ('UX Design'),
    ('Redes'),
    ('Atendimento ao Cliente'),
    ('Banco de Dados');

-- Relação tags x categorias
INSERT INTO tags_x_categorias (tag, categoria) VALUES
    (1, 1), -- JavaScript / Desenvolvimento
    (2, 1), -- React / Desenvolvimento
    (3, 1), -- Node.js / Desenvolvimento
    (4, 1), -- Python / Desenvolvimento
    (5, 1), -- SQL / Desenvolvimento
    (5, 3), -- SQL / Dados
    (10, 3), -- Banco de Dados / Dados
    (6, 2), -- Figma / Design
    (7, 2), -- UX Design / Design
    (8, 4), -- Redes / Suporte
    (9, 4); -- Atendimento ao Cliente / Suporte

-- Usuários de exemplo (1 instituição, 1 empresa, 1 aluno)
INSERT INTO usuarios (nome, email, senha, endereco, descricao, contato) VALUES
    (
        'Fatec Diadema',
        'contato@fatecdiadema.edu.br',
        UNHEX('33f975e5106b8ec70ae2e7b3af445607f0e09f182307ba89566bbd160d0af4db4d4c2bbd02ec4e8d530649b3655cb7855eb945026d6df9e4f494e5baf0a0851ac0deae644889b9450c7bbd7e66b5e107'),
        'Av. Fábio Eduardo Ramos Esquível, 2345 - Diadema, SP',
        'Instituição de ensino técnico e tecnológico',
        '(11) 4055-8800'
    ),
    (
        'SkillBridge Tecnologia Ltda',
        'contato@skillbridgetech.example.com',
        UNHEX('375d3fd1fe971efa71dead70fe91fadcde8bf6bfdee529be0bcf2dc60faebfe167a94ec3e4c8681c3b202a3897fb4ceaa03c6ce87202d95267eb464a906bcb74a7e0366543d164c0b61bd3cb0a6497ec'),
        'Rua Exemplo, 100 - Diadema, SP',
        'Empresa de desenvolvimento de software',
        '(11) 4000-0000'
    ),
    (
        'Ana Beatriz Souza',
        'ana.souza@aluno.fatecdiadema.edu.br',
        UNHEX('65b16302175a303af87b58d53c3b9378f93a486808ceacc0f82228fa373e03c20166e2ddd4f31eec77d01eb69af1b68dce9e2fd2ff0b9aec6f97c40bb6344b786e15806f28f31e71f81ad1370bfd973b'),
        'Rua Teste, 10 - Diadema, SP',
        'Estudante de ADS',
        '(11) 90000-0000'
    );

INSERT INTO instituicoes (cnpj, usuario) VALUES ('11222333000181', 1);
INSERT INTO empresas (cnpj, usuario) VALUES ('22333444000172', 2);
INSERT INTO alunos (ra, periodo, usuario, curso, instituicao) VALUES ('2024100012345', 'n', 3, 1, 1);

-- Vagas de exemplo da empresa cadastrada
INSERT INTO vagas (tipo, descricao, salario, horario_inicio, horario_termino, numero_de_vagas, empresa) VALUES
    ('Estágio', 'Vaga para estágio em desenvolvimento web, atuando com HTML, CSS, JavaScript e React.', 1200.00, '13:00:00', '18:00:00', 2, 1),
    ('Estágio', 'Vaga para estágio em banco de dados, dando suporte à equipe de desenvolvimento em consultas SQL.', 1200.00, '08:00:00', '13:00:00', 1, 1);

INSERT INTO tags_x_vagas (tag, vaga) VALUES
    (1, 1), -- JavaScript na vaga 1
    (2, 1), -- React na vaga 1
    (5, 2), -- SQL na vaga 2
    (10, 2); -- Banco de Dados na vaga 2

INSERT INTO tags_x_alunos (tag, aluno) VALUES
    (1, 1), -- JavaScript
    (2, 1); -- React

-- Candidatura de exemplo, ainda sem decisão da empresa (aceito = NULL)
INSERT INTO candidaturas (aceito, aluno, vaga) VALUES (NULL, 1, 1);
