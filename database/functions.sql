-- Execução manual: mysql --default-character-set=utf8mb4 -u <usuario> -p <nome_do_banco> < database/functions.sql
-- Container MySQL (docker-entrypoint-initdb.d): renomeie com prefixo numérico
-- para rodar depois de schema.sql (ex.: 04-functions.sql), pois o container
-- executa os arquivos em ordem alfabética. A diretiva DELIMITER abaixo é
-- entendida pelo cliente "mysql" (usado tanto na execução manual quanto pelo
-- container); não funciona com drivers que enviam o SQL direto ao servidor.

DELIMITER $$

CREATE FUNCTION fn_contar_candidaturas_vaga(p_vaga_id INT)
RETURNS INT
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM candidaturas WHERE vaga = p_vaga_id;
    RETURN total;
END$$

CREATE FUNCTION fn_contar_vagas_empresa(p_empresa_id INT)
RETURNS INT
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM vagas WHERE empresa = p_empresa_id;
    RETURN total;
END$$

DELIMITER ;
