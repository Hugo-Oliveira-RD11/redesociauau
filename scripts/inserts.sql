USE rededb;

-- Inserindo dados na tabela usuarios
INSERT INTO usuarios (id_usuario, email, nome_usuario, foto_perfil, data_nascimento, tags) VALUES
(1, 'joao.silva@email.com', 'JoaoSilva', 'foto_joao.jpg', '1990-05-15', 'tecnologia, games'),
(2, 'maria.souza@email.com', 'MariaSouza', 'foto_maria.jpg', '1988-11-22', 'culinaria, viagens'),
(3, 'pedro.ferreira@email.com', 'PedroF', 'foto_pedro.jpg', '1995-03-01', 'musica, esportes'),
(4, 'ana.gomes@email.com', 'AnaGomes', 'foto_ana.jpg', '1992-07-30', 'leitura, arte'),
(5, 'carlos.pereira@email.com', 'CPereira', 'foto_carlos.jpg', '1985-01-10', 'negocios, finanças'),
(6, 'julia.lima@email.com', 'JuliaL', 'foto_julia.jpg', '1998-09-03', 'moda, fotografia'),
(7, 'rafael.costa@email.com', 'RafaCosta', 'foto_rafael.jpg', '1991-04-25', 'programacao, ciencia'),
(8, 'fernanda.alves@email.com', 'FAlves', 'foto_fernanda.jpg', '1987-12-08', 'saude, bem-estar'),
(9, 'gustavo.rocha@email.com', 'GusRocha', 'foto_gustavo.jpg', '1993-06-18', 'filmes, series'),
(10, 'patricia.santos@email.com', 'PatySantos', 'foto_patricia.jpg', '1996-02-14', 'pets, natureza');

-- Inserindo dados na tabela grupos
INSERT INTO grupos (id_grupo, nome, descricao, criado_por, data_criacao) VALUES
(101, 'Devs Brasil', 'Comunidade de desenvolvedores brasileiros.', 1, '2023-01-01'),
(102, 'Viagens Aventura', 'Grupo para amantes de viagens e aventuras.', 2, '2023-02-10'),
(103, 'Culinaria Criativa', 'Receitas e dicas de culinária para inspirar.', 2, '2023-03-05'),
(104, 'Fitness e Saude', 'Dicas para uma vida mais saudável e ativa.', 8, '2023-04-20'),
(105, 'Amantes de Cinema', 'Discussões sobre filmes e séries.', 9, '2023-05-12'),
(106, 'Startups BR', 'Conectando empreendedores e investidores.', 5, '2023-06-01'),
(107, 'Fotografia Digital', 'Compartilhe sua paixão pela fotografia.', 6, '2023-07-15'),
(108, 'Leitores Compulsivos', 'Clube do livro e discussões literárias.', 4, '2023-08-01'),
(109, 'Jogos Online', 'Para quem curte jogos online e eSports.', 1, '2023-09-10'),
(110, 'Ecologia e Meio Ambiente', 'Discutindo a preservação do planeta.', 10, '2023-10-05');

-- Inserindo dados na tabela postagens
INSERT INTO postagens (id_postagem, conteudo, tipo, data_criacao, upvote, downvote, postado_por) VALUES
(1, 'Primeira postagem da rede! Bem-vindos!', 'texto', '2024-01-01', 15, 0, 1),
(2, 'Minha receita de bolo de chocolate ficou perfeita!', 'foto', '2024-01-02', 20, 1, 2),
(3, 'Qual a melhor linguagem de programação para iniciantes?', 'pergunta', '2024-01-03', 10, 0, 7),
(4, 'Paisagens incríveis da minha última viagem.', 'foto', '2024-01-04', 30, 2, 2),
(5, 'Dicas para manter o foco nos estudos.', 'texto', '2024-01-05', 12, 0, 4),
(6, 'Novo setup para games! O que acharam?', 'foto', '2024-01-06', 25, 0, 3),
(7, 'Desafio de 30 dias de exercícios, quem topa?', 'texto', '2024-01-07', 18, 0, 8),
(8, 'Minha análise do último filme de ficção científica.', 'video', '2024-01-08', 22, 1, 9),
(9, 'A importância da saúde mental no ambiente de trabalho.', 'texto', '2024-01-09', 14, 0, 5),
(10, 'Melhores locais para tirar fotos na cidade.', 'foto', '2024-01-10', 28, 0, 6);

-- Inserindo dados na tabela mensagens
INSERT INTO mensagens (id_mensagem, conteudo, enviado_por, recebido_por) VALUES
(1, 'Olá João, tudo bem?', 2, 1),
(2, 'Tudo ótimo, Maria! E você?', 1, 2),
(3, 'Vi sua postagem sobre viagem, muito legal!', 4, 2),
(4, 'Preciso de uma dica de livro.', 5, 4),
(5, 'Adorei a receita que você postou!', 3, 2),
(6, 'Que dia é a próxima reunião do grupo de devs?', 7, 1),
(7, 'Vamos sair para fotografar neste fim de semana?', 10, 6),
(8, 'Obrigado pela dica do filme, vou assistir!', 1, 9),
(9, 'Conseguiu resolver aquele bug?', 5, 7),
(10, 'Boas vibrações para você!', 8, 3);

-- Inserindo dados na tabela seguidores
INSERT INTO seguidores (id_seguidor, id_seguido) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 1),
(4, 2),
(5, 7),
(6, 10),
(7, 5),
(8, 4),
(9, 1);

-- Inserindo dados na tabela lista_mebros_grupo (considerando id_usuario como FK para usuarios)
INSERT INTO lista_mebros_grupo (id_grupo, id_usuario, funcao) VALUES
(101, 1, 'administrador'),
(101, 7, 'membro'),
(102, 2, 'administrador'),
(102, 4, 'membro'),
(103, 2, 'membro'),
(104, 8, 'administrador'),
(105, 9, 'membro'),
(106, 5, 'administrador'),
(107, 6, 'membro'),
(109, 3, 'membro');

-- Inserindo dados na tabela comentarios
INSERT INTO comentarios (id_comentario, conteudo, upvote, downvote, id_postagem, id_usuario, id_comentario_pai) VALUES
(1, 'Que legal! Bem-vindos!', 5, 0, 1, 2, NULL),
(2, 'Adoro bolo de chocolate!', 8, 0, 2, 1, NULL),
(3, 'Eu sugiro Python para iniciantes.', 10, 0, 3, 5, NULL),
(4, 'Fotos espetaculares!', 7, 0, 4, 3, NULL),
(5, 'Ótimas dicas, vou aplicar!', 6, 0, 5, 9, NULL),
(6, 'Parabéns pelo setup, muito top!', 9, 0, 6, 1, NULL),
(7, 'To dentro do desafio!', 12, 0, 7, 10, NULL),
(8, 'Concordo, Python é uma ótima escolha.', 4, 0, 3, 7, 3), -- Resposta ao comentário 3
(9, 'Viagem incrível! Fui para lá no ano passado.', 5, 0, 4, 6, 4), -- Resposta ao comentário 4
(10, 'Que filme você recomenda?', 3, 0, 8, 2, NULL);
