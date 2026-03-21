CREATE TABLE utilizador (
    uti_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    genero VARCHAR(10),
    telemovel VARCHAR(20),

    tipo ENUM('UTILIZADOR','PSP') DEFAULT 'UTILIZADOR',
    estado BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE agente_psp (
    psp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uti_id BIGINT NOT NULL,

    codigo_acesso VARCHAR(255) NOT NULL,
    esquadra_id BIGINT,

    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id) ON DELETE CASCADE,
    FOREIGN KEY (esquadra_id) REFERENCES esquadra(esq_id)
);


CREATE TABLE tipo_denuncia (
    tipo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    descricao VARCHAR(255)
);


CREATE TABLE denuncia (
    den_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    uti_id BIGINT,
    tipo_id BIGINT NOT NULL,

    descricao TEXT NOT NULL,

    data_ocorrencia DATETIME,
    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    estado ENUM('PENDENTE','EM_ANALISE','RESOLVIDO') DEFAULT 'PENDENTE',
    grau_perigo ENUM('BAIXO','MEDIO','ALTO'),

    anonimato BOOLEAN DEFAULT FALSE,

    loc_id BIGINT,
    esquadra_id BIGINT,

    psp_responsavel_id BIGINT,

    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id) ON DELETE SET NULL,
    FOREIGN KEY (tipo_id) REFERENCES tipo_denuncia(tipo_id),
    FOREIGN KEY (loc_id) REFERENCES localizacao(loc_id),
    FOREIGN KEY (esquadra_id) REFERENCES esquadra(esq_id),
    FOREIGN KEY (psp_responsavel_id) REFERENCES agente_psp(psp_id
);



CREATE TABLE localizacao (
    loc_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude DOUBLE,
    longitude DOUBLE,
    endereco VARCHAR(255),
    distrito VARCHAR(100),
    concelho VARCHAR(100),

    INDEX(latitude),
    INDEX(longitude)
);



CREATE TABLE evidencia (
    ev_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    den_id BIGINT,
    ficheiro VARCHAR(255),
    tipo VARCHAR(50),
    descricao VARCHAR(255),

    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (den_id) REFERENCES denuncia(den_id) ON DELETE CASCADE
);

CREATE TABLE chat (
    chat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    den_id BIGINT,
    uti_id BIGINT,

    mensagem TEXT,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (den_id) REFERENCES denuncia(den_id) ON DELETE CASCADE,
    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id)
);


CREATE TABLE notificacao (
    not_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uti_id BIGINT,
    den_id BIGINT,

    mensagem VARCHAR(255),
    tipo VARCHAR(50),

    lida BOOLEAN DEFAULT FALSE,

    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id),
    FOREIGN KEY (den_id) REFERENCES denuncia(den_id)
);

CREATE TABLE esquadra (
    esq_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150),

    distrito VARCHAR(100),
    concelho VARCHAR(100),

    latitude DOUBLE,
    longitude DOUBLE,

    contacto VARCHAR(20),

    especializada_ciber BOOLEAN DEFAULT TRUE
);



CREATE TABLE relatorio_psp (
    rel_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    den_id BIGINT,
    psp_id BIGINT,

    descricao TEXT,
    acao_tomada TEXT,

    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (den_id) REFERENCES denuncia(den_id),
    FOREIGN KEY (psp_id) REFERENCES agente_psp(psp_id)
);
