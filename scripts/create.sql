CREATE DATABASE IF NOT EXISTS rededb;

USE rededb;

CREATE TABLE usuarios (
    id_usuario int NOT NULL,
    email varchar(100) NOT NULL,
    nome_usuario varchar(100) NOT NULL,
    foto_perfil varchar(100) NOT NULL, -- É realmente string?--
    data_nascimento date NOT NULL,
    tags varchar(255) NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (
        id_usuario
     ),
    CONSTRAINT uc_usuarios_email UNIQUE (
        email
    )
);

CREATE TABLE mensagens (
    id_mensagem int NOT NULL,
    conteudo varchar(255) NOT NULL,
    enviado_por int NOT NULL, -- Deveria ser FK? --
    recebido_por int NOT NULL, -- Deveria ser FK? --
    CONSTRAINT pk_mensagens PRIMARY KEY (
        id_mensagem
     )
);

CREATE TABLE grupos (
    id_grupo int NOT NULL,
    nome varchar(100) NOT NULL,
    descricao varchar(255) NOT NULL,
    criado_por int NOT NULL, -- FK? --
    data_criacao date NOT NULL,
    CONSTRAINT pk_grupos PRIMARY KEY (
        id_grupo
     ),
    CONSTRAINT uc_grupos_nome UNIQUE (
        nome
    )
);

CREATE TABLE lista_mebros_grupo (
    id_grupo int NOT NULL, -- FK? --
    id_usuario int NOT NULL,
    funcao varchar(50) NOT NULL
);

CREATE TABLE seguidores (
    id_seguidor int NOT NULL,
    id_seguido int NOT NULL
);

CREATE TABLE postagens (
    id_postagem int NOT NULL,
    conteudo varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    data_criacao date NOT NULL,
    upvote int NOT NULL,
    downvote int NOT NULL,
    postado_por int NOT NULL,
    CONSTRAINT pk_postagens PRIMARY KEY (
        id_postagem
     )
);

CREATE TABLE comentarios (
    id_comentario int   NOT NULL,
    conteudo varchar(255)   NOT NULL,
    upvote int   NOT NULL,
    downvote int   NOT NULL,
    id_postagem int   NOT NULL,
    id_usuario int   NOT NULL,
    id_comentario_pai int   NULL,
    CONSTRAINT pk_comentarios PRIMARY KEY (
        id_comentario
     )
);

ALTER TABLE mensagens ADD CONSTRAINT fk_mensagens_enviado_por FOREIGN KEY(enviado_por)
REFERENCES usuarios (id_usuario);

ALTER TABLE mensagens ADD CONSTRAINT fk_mensagens_recebido_por FOREIGN KEY(recebido_por)
REFERENCES usuarios (id_usuario);

ALTER TABLE grupos ADD CONSTRAINT fk_grupos_criado_por FOREIGN KEY(criado_por)
REFERENCES usuarios (id_usuario);

ALTER TABLE lista_mebros_grupo ADD CONSTRAINT fk_lista_mebros_grupo_id_grupo_id_usuario FOREIGN KEY(id_grupo, id_usuario)
REFERENCES grupos (id_grupo, criado_por);

ALTER TABLE seguidores ADD CONSTRAINT fk_seguidores_id_seguidor FOREIGN KEY(id_seguidor)
REFERENCES usuarios (id_usuario);

ALTER TABLE seguidores ADD CONSTRAINT fk_seguidores_id_seguido FOREIGN KEY(id_seguido)
REFERENCES usuarios (id_usuario);

ALTER TABLE postagens ADD CONSTRAINT fk_postagens_postado_por FOREIGN KEY(postado_por)
REFERENCES usuarios (id_usuario);

ALTER TABLE comentarios ADD CONSTRAINT fk_comentarios_id_postagem_id_usuario FOREIGN KEY(id_postagem, id_usuario)
REFERENCES postagens (id_postagem, postado_por);
