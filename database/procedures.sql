-- Execução manual: mysql --default-character-set=utf8mb4 -u <usuario> -p <nome_do_banco> < database/procedures.sql
-- Container MySQL (docker-entrypoint-initdb.d): renomeie com prefixo numérico
-- para rodar depois de schema.sql (ex.: 05-procedures.sql), pois o container
-- executa os arquivos em ordem alfabética. A diretiva DELIMITER abaixo é
-- entendida pelo cliente "mysql" (usado tanto na execução manual quanto pelo
-- container); não funciona com drivers que enviam o SQL direto ao servidor.

DELIMITER $$

CREATE PROCEDURE sp_registrar_candidatura(IN p_aluno_id INT, IN p_vaga_id INT)
BEGIN
    IF EXISTS (SELECT 1 FROM candidaturas WHERE aluno = p_aluno_id AND vaga = p_vaga_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Aluno já se candidatou a esta vaga.';
    ELSE
        INSERT INTO candidaturas (aceito, aluno, vaga) VALUES (NULL, p_aluno_id, p_vaga_id);
    END IF;
END$$

CREATE PROCEDURE sp_atualizar_status_candidatura(IN p_candidatura_id INT, IN p_aceito BOOLEAN)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM candidaturas WHERE id = p_candidatura_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Candidatura não encontrada.';
    ELSE
        UPDATE candidaturas SET aceito = p_aceito WHERE id = p_candidatura_id;
    END IF;
END$$

DELIMITER ;
