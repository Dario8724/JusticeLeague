

-- ============================================================
-- 1. utilizador
-- ============================================================
INSERT INTO utilizador (nome, email, password, data_nascimento, genero, telemovel, tipo, estado, verificado) VALUES
('Ana Ferreira',    'ana.ferreira@email.pt',    '$2b$12$hashed_password_1', '1990-03-15', 'Feminino',  '912345678', 'UTILIZADOR', TRUE,  TRUE),
('Bruno Martins',  'bruno.martins@email.pt',   '$2b$12$hashed_password_2', '1985-07-22', 'Masculino', '923456789', 'UTILIZADOR', TRUE,  TRUE),
('Carla Sousa',    'carla.sousa@email.pt',      '$2b$12$hashed_password_3', '1995-11-08', 'Feminino',  '934567890', 'UTILIZADOR', TRUE,  FALSE),
('Daniel Costa',   'daniel.costa@email.pt',     '$2b$12$hashed_password_4', '1988-01-30', 'Masculino', '945678901', 'UTILIZADOR', TRUE,  TRUE),
('Eva Santos',     'eva.santos@email.pt',       '$2b$12$hashed_password_5', '2000-06-12', 'Feminino',  '956789012', 'UTILIZADOR', FALSE, TRUE),
-- Agentes PSP (tipo = 'PSP')
('Inspetor Ramos', 'ramos.psp@psp.pt',          '$2b$12$hashed_password_6', '1978-09-05', 'Masculino', '961111111', 'PSP',        TRUE,  TRUE),
('Agente Lima',    'lima.psp@psp.pt',           '$2b$12$hashed_password_7', '1982-04-18', 'Feminino',  '962222222', 'PSP',        TRUE,  TRUE),
('Subinspetor Neves','neves.psp@psp.pt',        '$2b$12$hashed_password_8', '1975-12-01', 'Masculino', '963333333', 'PSP',        TRUE,  TRUE);


-- ============================================================
-- 2. tipo_denuncia
-- ============================================================
INSERT INTO tipo_denuncia (nome, descricao) VALUES
('Phishing',              'Tentativa de obter dados pessoais ou bancários através de emails ou sites falsos'),
('Burla Informática',     'Fraude cometida através de meios informáticos com prejuízo financeiro para a vítima'),
('Cyberbullying',         'Assédio, intimidação ou humilhação repetida através de meios digitais'),
('Acesso Ilegítimo',      'Acesso não autorizado a sistemas, contas ou dispositivos alheios'),
('Sextorsão',             'Ameaça de divulgação de imagens íntimas para extorquir dinheiro ou favores'),
('Roubo de Identidade',   'Uso não autorizado de dados pessoais de terceiros para fins fraudulentos'),
('Desinformação',         'Difusão intencional de informação falsa com intenção de causar dano'),
('Stalking Digital',      'Perseguição ou vigilância repetida de uma pessoa através de meios digitais');


-- ============================================================
-- 3. localizacao
-- ============================================================
INSERT INTO localizacao (latitude, longitude, endereco, distrito, concelho) VALUES
(38.7169,  -9.1395,  'Rua Augusta 45, Lisboa',                    'Lisboa',   'Lisboa'),
(41.1496,  -8.6109,  'Rua de Santa Catarina 120, Porto',          'Porto',    'Porto'),
(38.5244,  -8.8882,  'Praça do Giraldo 3, Évora',                 'Évora',    'Évora'),
(40.2033,  -8.4103,  'Rua Ferreira Borges 67, Coimbra',           'Coimbra',  'Coimbra'),
(37.0194,  -7.9322,  'Rua de Santo António 12, Faro',             'Faro',     'Faro'),
(38.6663,  -9.2044,  'Avenida Marginal 200, Oeiras',              'Lisboa',   'Oeiras'),
(41.5369,  -8.4197,  'Praça da República 8, Braga',               'Braga',    'Braga'),
(32.6500,  -16.9000, 'Avenida do Mar 5, Funchal',                 'Madeira',  'Funchal');


-- ============================================================
-- 4. esquadra
-- ============================================================
INSERT INTO esquadra (nome, distrito, concelho, latitude, longitude, contacto, especializada_ciber) VALUES
('Esquadra de Cibercrime de Lisboa',      'Lisboa',  'Lisboa',  38.7200, -9.1350,  '213456789', TRUE),
('Esquadra de Cibercrime do Porto',       'Porto',   'Porto',   41.1520, -8.6090,  '222345678', TRUE),
('Esquadra de Cibercrime de Coimbra',     'Coimbra', 'Coimbra', 40.2050, -8.4120,  '239345678', TRUE),
('Divisão de Investigação Criminal Faro', 'Faro',    'Faro',    37.0200, -7.9310,  '289345678', FALSE),
('Esquadra de Braga',                     'Braga',   'Braga',   41.5380, -8.4180,  '253345678', FALSE);


-- ============================================================
-- 5. agente_psp
-- ============================================================
INSERT INTO agente_psp (uti_id, codigo_acesso, esquadra_id) VALUES
(6, '$2b$12$hash_codigo_ramos', 1),   -- Inspetor Ramos → Lisboa
(7, '$2b$12$hash_codigo_lima',  2),   -- Agente Lima    → Porto
(8, '$2b$12$hash_codigo_neves', 1);   -- Subinspetor Neves → Lisboa


-- ============================================================
-- 6. denuncia
-- ============================================================
INSERT INTO denuncia (uti_id, tipo_id, descricao, data_ocorrencia, estado, grau_perigo, anonimato, loc_id, esquadra_id, psp_responsavel_id) VALUES
(1, 1, 'Recebi um email a fingir ser do banco BPI a pedir as minhas credenciais. Cliquei no link e introduzi os dados antes de perceber que era fraude.',
    '2026-03-01 10:30:00', 'EM_ANALISE', 'ALTO',  FALSE, 1, 1, 1),

(2, 2, 'Fiz uma compra online de €850 num site que parecia legítimo. O produto nunca chegou e o site desapareceu.',
    '2026-03-05 14:00:00', 'PENDENTE',   'MEDIO', FALSE, 2, 2, NULL),

(3, 3, 'Estou a ser assediada num grupo de WhatsApp por colegas de trabalho. Enviam mensagens humilhantes diariamente.',
    '2026-02-20 09:00:00', 'RESOLVIDO',  'MEDIO', FALSE, 1, 1, 1),

(NULL, 5, 'Recebi ameaças de publicação de fotos íntimas caso não pague 500€ em criptomoeda.',
    '2026-03-10 22:15:00', 'EM_ANALISE', 'ALTO',  TRUE,  NULL, 1, 2),   -- anónimo

(4, 4, 'Alguém acedeu à minha conta de email e enviou mensagens em meu nome para os meus contactos.',
    '2026-03-12 08:45:00', 'PENDENTE',   'ALTO',  FALSE, 4, 1, NULL),

(1, 6, 'Descobri que alguém está a usar o meu NIF e morada para fazer compras a crédito.',
    '2026-03-15 16:20:00', 'PENDENTE',   'ALTO',  FALSE, 1, 1, 3),

(2, 8, 'Uma pessoa desconhecida sabe a minha rotina diária ao detalhe e envia-me mensagens descrevendo onde estive.',
    '2026-03-18 11:00:00', 'PENDENTE',   'MEDIO', FALSE, 2, 2, NULL);


-- ============================================================
-- 7. evidencia
-- ============================================================
INSERT INTO evidencia (den_id, ficheiro, tipo, descricao) VALUES
(1, 'capturas/email_phishing_bpi.png',     'imagem', 'Screenshot do email fraudulento recebido'),
(1, 'capturas/site_falso_bpi.png',         'imagem', 'Screenshot da página falsa do banco'),
(2, 'documentos/comprovativo_pagamento.pdf','pdf',   'Comprovativo de pagamento de €850'),
(2, 'capturas/site_fraude.png',            'imagem', 'Screenshot do site que já não existe'),
(3, 'capturas/mensagens_assedio.png',      'imagem', 'Captura das mensagens do grupo de WhatsApp'),
(4, 'capturas/ameaca_sextorsao.png',       'imagem', 'Screenshot da mensagem de ameaça recebida'),
(5, 'capturas/email_enviado_sem_ser_eu.png','imagem','Email enviado da minha conta sem minha autorização'),
(6, 'documentos/carta_cobranca.pdf',       'pdf',    'Carta de cobrança de crédito que nunca contratei');


-- ============================================================
-- 8. chat
-- ============================================================
INSERT INTO chat (den_id, uti_id, mensagem) VALUES
(1, 1, 'Bom dia, posso fornecer mais informações sobre o email que recebi?'),
(1, 6, 'Bom dia Ana. Sim, por favor envie o cabeçalho completo do email (headers) para análise forense.'),
(1, 1, 'Já enviei como evidência. O email veio de suporte@bpi-seguranca.net'),
(1, 6, 'Obrigado. Esse domínio já é conhecido nas nossas bases de dados. Vamos prosseguir com a investigação.'),

(3, 3, 'A situação foi resolvida. A empresa tomou medidas disciplinares contra os colegas envolvidos.'),
(3, 6, 'Fico satisfeito com a resolução. O processo fica arquivado. Qualquer nova ocorrência contacte-nos.'),

(4, NULL, 'Quero acompanhar o estado da minha denúncia anónima sobre sextorsão.'),
(4, 7,   'Estamos a investigar ativamente. Não efectue qualquer pagamento. Tentaremos rastrear a origem.');


-- ============================================================
-- 9. notificacao
-- ============================================================
INSERT INTO notificacao (uti_id, den_id, mensagem, tipo, lida) VALUES
(1, 1, 'A sua denúncia #1 foi recebida e está em análise.',            'INFO',    TRUE),
(1, 1, 'O agente Inspetor Ramos foi atribuído à sua denúncia #1.',     'INFO',    TRUE),
(1, 1, 'Tem uma nova mensagem na denúncia #1.',                        'CHAT',    FALSE),
(2, 2, 'A sua denúncia #2 foi recebida com sucesso.',                  'INFO',    TRUE),
(2, 2, 'A sua denúncia #2 aguarda atribuição a um agente.',            'AVISO',   FALSE),
(3, 3, 'A sua denúncia #3 foi marcada como RESOLVIDA.',                'SUCESSO', TRUE),
(4, 5, 'A sua denúncia #5 foi recebida e está pendente de análise.',   'INFO',    FALSE),
(1, 6, 'Foi registada uma nova denúncia de roubo de identidade (#6).', 'AVISO',   FALSE);


-- ============================================================
-- 10. relatorio_psp
-- ============================================================
INSERT INTO relatorio_psp (den_id, psp_id, descricao, acao_tomada) VALUES
(1, 1,
 'Email de phishing identificado como pertencente a campanha massiva dirigida a clientes do BPI. Domínio remetente registado em servidor estrangeiro. Credenciais da vítima potencialmente comprometidas.',
 'Notificação enviada ao BPI-CERT para bloqueio do domínio fraudulento. Recomendada alteração imediata de password e ativação de 2FA. Caso reportado à Unidade Nacional de Combate ao Cibercrime (UNC3T).'),

(3, 1,
 'Situação de cyberbullying em contexto laboral confirmada após análise das mensagens submetidas como evidência. Identificados 3 autores no grupo de WhatsApp.',
 'Contacto estabelecido com a entidade patronal. Instaurado processo disciplinar interno. Vítima encaminhada para apoio psicológico. Caso encerrado após resolução satisfatória.'),

(4, 2,
 'Denúncia anónima de sextorsão. Análise da mensagem de ameaça revelou uso de serviço de email temporário. Montante exigido: 500€ em Bitcoin.',
 'Investigação em curso. Solicitada colaboração internacional para rastreio da carteira de criptomoeda. Vítima aconselhada a não efectuar pagamentos e a preservar todas as comunicações.');
