-- 1. Consultar informações de um usuário e o número de seguidores e quem ele segue
-- Esta consulta retorna o nome de usuário, email, foto de perfil, e a contagem de seguidores e seguidos.
SELECT
    u.nome_usuario,
    u.email,
    u.foto_perfil,
    (SELECT COUNT(*) FROM seguidores WHERE id_seguido = u.id_usuario) AS total_seguidores,
    (SELECT COUNT(*) FROM seguidores WHERE id_seguidor = u.id_usuario) AS total_seguindo
FROM
    usuarios u
WHERE
    u.id_usuario = 1; -- Substitua '1' pelo ID do usuário desejado

-- 2. Listar as postagens de um usuário específico, ordenadas pelas mais populares (maior upvote)
-- Mostra o conteúdo da postagem, tipo, data de criação, upvotes e downvotes,
-- para um usuário específico, ordenado por upvotes decrescentes.
SELECT
    p.conteudo,
    p.tipo,
    p.data_criacao,
    p.upvote,
    p.downvote
FROM
    postagens p
WHERE
    p.postado_por = 2 -- Substitua '2' pelo ID do usuário cujas postagens você quer ver
ORDER BY
    p.upvote DESC;

-- 3. Encontrar todos os membros de um grupo específico e suas funções
-- Retorna o nome do usuário e sua função dentro de um grupo específico.
SELECT
    u.nome_usuario,
    lmg.funcao
FROM
    lista_mebros_grupo lmg
JOIN
    usuarios u ON lmg.id_usuario = u.id_usuario
WHERE
    lmg.id_grupo = 101; -- Substitua '101' pelo ID do grupo desejado

-- 4. Recuperar as mensagens mais recentes trocadas entre dois usuários
-- Esta consulta busca as 5 últimas mensagens entre dois usuários (enviadas ou recebidas),
-- ordenadas pela ID da mensagem (assumindo que IDs maiores são mais recentes).
SELECT
    m.conteudo,
    CASE
        WHEN m.enviado_por = 1 THEN 'Eu'
        ELSE (SELECT nome_usuario FROM usuarios WHERE id_usuario = m.enviado_por)
    END AS enviado_por,
    CASE
        WHEN m.recebido_por = 1 THEN 'Eu'
        ELSE (SELECT nome_usuario FROM usuarios WHERE id_usuario = m.recebido_por)
    END AS recebido_por
FROM
    mensagens m
WHERE
    (m.enviado_por = 1 AND m.recebido_por = 2) -- Usuário 1 envia para Usuário 2
    OR (m.enviado_por = 2 AND m.recebido_por = 1) -- Usuário 2 envia para Usuário 1
ORDER BY
    m.id_mensagem DESC
LIMIT 5;

-- 5. Listar postagens com seus comentários e quem os fez
-- Retorna o conteúdo da postagem, o conteúdo de cada comentário, o nome do usuário que comentou,
-- e se o comentário é uma resposta a outro comentário (mostrando o conteúdo do comentário pai).
SELECT
    p.conteudo AS postagem_conteudo,
    c.conteudo AS comentario_conteudo,
    u.nome_usuario AS quem_comentou,
    c.upvote AS comentario_upvote,
    c.downvote AS comentario_downvote,
    (SELECT c2.conteudo FROM comentarios c2 WHERE c2.id_comentario = c.id_comentario_pai) AS comentario_pai_conteudo
FROM
    postagens p
JOIN
    comentarios c ON p.id_postagem = c.id_postagem
JOIN
    usuarios u ON c.id_usuario = u.id_usuario
ORDER BY
    p.id_postagem, c.id_comentario;
