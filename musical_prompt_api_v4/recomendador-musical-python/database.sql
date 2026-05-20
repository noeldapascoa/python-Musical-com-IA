CREATE TABLE IF NOT EXISTS recomendacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artistas_informados TEXT,
    musicas_informadas TEXT,
    perfil TEXT,
    origem TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artistas_recomendados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recomendacao_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    FOREIGN KEY (recomendacao_id) REFERENCES recomendacoes(id)
);

CREATE TABLE IF NOT EXISTS musicas_recomendadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recomendacao_id INTEGER NOT NULL,
    musica TEXT,
    artista TEXT,
    motivo TEXT,
    FOREIGN KEY (recomendacao_id) REFERENCES recomendacoes(id)
);
