SET SQL_SAFE_UPDATES = 0;

ALTER TABLE usuarios;
UPDATE usuarios u
SET total_seguidores = (
    SELECT COUNT(*)
    FROM seguidores s
    WHERE s.id_seguido = u.id_usuario
);

SET SQL_SAFE_UPDATES = 1;
