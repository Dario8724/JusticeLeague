

-- 1. Sem dependências externas
CREATE TABLE utilizador (
    uti_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(100),
    email           VARCHAR(150) UNIQUE,
    password        VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    genero          VARCHAR(10),
    telemovel       VARCHAR(20),
    tipo            ENUM('UTILIZADOR','PSP') DEFAULT 'UTILIZADOR',
    estado          BOOLEAN DEFAULT TRUE,
    verificado      BOOLEAN DEFAULT FALSE,
    criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sem dependências externas
CREATE TABLE tipo_denuncia (
    tipo_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    descricao VARCHAR(255)
);

-- 3. Sem dependências externas
CREATE TABLE localizacao (
    loc_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude  DOUBLE,
    longitude DOUBLE,
    endereco  VARCHAR(255),
    distrito  VARCHAR(100),
    concelho  VARCHAR(100),
    INDEX (latitude),
    INDEX (longitude)
);

-- 4. Sem dependências externas
CREATE TABLE esquadra (
    esq_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(150) NOT NULL,
    distrito           VARCHAR(100),
    concelho           VARCHAR(100),
    latitude           DOUBLE,
    longitude          DOUBLE,
    contacto           VARCHAR(20),
    especializada_ciber BOOLEAN DEFAULT TRUE
);

-- 5. Depende de: utilizador, esquadra
CREATE TABLE agente_psp (
    psp_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    uti_id        BIGINT NOT NULL,
    codigo_acesso VARCHAR(255) NOT NULL,   -- guardar como hash (bcrypt/argon2)
    esquadra_id   BIGINT,
    FOREIGN KEY (uti_id)      REFERENCES utilizador(uti_id) ON DELETE CASCADE,
    FOREIGN KEY (esquadra_id) REFERENCES esquadra(esq_id)   ON DELETE SET NULL
);

-- 6. Depende de: utilizador, tipo_denuncia, localizacao, esquadra, agente_psp
CREATE TABLE denuncia (
    den_id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    uti_id             BIGINT,
    tipo_id            BIGINT NOT NULL,
    descricao          TEXT NOT NULL,
    data_ocorrencia    DATETIME,
    data_registo       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado             ENUM('PENDENTE','EM_ANALISE','RESOLVIDO') DEFAULT 'PENDENTE',
    grau_perigo        ENUM('BAIXO','MEDIO','ALTO'),
    anonimato          BOOLEAN DEFAULT FALSE,
    loc_id             BIGINT,
    esquadra_id        BIGINT,
    psp_responsavel_id BIGINT,
    FOREIGN KEY (uti_id)             REFERENCES utilizador(uti_id)    ON DELETE SET NULL,
    FOREIGN KEY (tipo_id)            REFERENCES tipo_denuncia(tipo_id) ON DELETE RESTRICT,
    FOREIGN KEY (loc_id)             REFERENCES localizacao(loc_id)   ON DELETE SET NULL,
    FOREIGN KEY (esquadra_id)        REFERENCES esquadra(esq_id)      ON DELETE SET NULL,
    FOREIGN KEY (psp_responsavel_id) REFERENCES agente_psp(psp_id)    ON DELETE SET NULL
);

-- 7. Depende de: denuncia
CREATE TABLE evidencia (
    ev_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    den_id       BIGINT NOT NULL,
    ficheiro     VARCHAR(255) NOT NULL,
    tipo         VARCHAR(50),
    descricao    VARCHAR(255),
    data_upload  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (den_id) REFERENCES denuncia(den_id) ON DELETE CASCADE
);

-- 8. Depende de: denuncia, utilizador
CREATE TABLE chat (
    chat_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    den_id     BIGINT NOT NULL,
    uti_id     BIGINT,
    mensagem   TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (den_id) REFERENCES denuncia(den_id)  ON DELETE CASCADE,
    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id) ON DELETE SET NULL
);

-- 9. Depende de: utilizador, denuncia
CREATE TABLE notificacao (
    not_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    uti_id     BIGINT,
    den_id     BIGINT,
    mensagem   VARCHAR(255) NOT NULL,
    tipo       VARCHAR(50),
    lida       BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uti_id) REFERENCES utilizador(uti_id) ON DELETE CASCADE,
    FOREIGN KEY (den_id) REFERENCES denuncia(den_id)   ON DELETE CASCADE
);

-- 10. Depende de: denuncia, agente_psp
CREATE TABLE relatorio_psp (
    rel_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    den_id       BIGINT NOT NULL,
    psp_id       BIGINT NOT NULL,
    descricao    TEXT,
    acao_tomada  TEXT,
    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (den_id) REFERENCES denuncia(den_id)   ON DELETE CASCADE,
    FOREIGN KEY (psp_id) REFERENCES agente_psp(psp_id) ON DELETE RESTRICT
);
