-- Punto de Juego · creación y carga de la base puntdejoc (MariaDB, utf8mb4)
-- Orden por dependencias de FK: jocs → activitats → inscripcions / rondes → partides.

CREATE DATABASE puntdejoc
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE puntdejoc;

CREATE TABLE jocs (
    id INT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE activitats (
    id INT PRIMARY KEY,
    joc_id INT NOT NULL,
    titol VARCHAR(150) NOT NULL,
    tipus ENUM('trobada', 'torneig') NOT NULL,
    estat ENUM('borrador', 'oberta', 'en_curs', 'finalitzada') NOT NULL,
    data DATE NOT NULL,
    lloc VARCHAR(150) NOT NULL,
    places INT NOT NULL,
    CHECK (places > 0),
    FOREIGN KEY (joc_id) REFERENCES jocs(id)
) ENGINE=InnoDB;

CREATE TABLE inscripcions (
    id INT PRIMARY KEY,
    activitat_id INT NOT NULL,
    alias VARCHAR(60) NOT NULL,
    UNIQUE (activitat_id, alias),
    FOREIGN KEY (activitat_id) REFERENCES activitats(id)
) ENGINE=InnoDB;

CREATE TABLE rondes (
    id INT PRIMARY KEY,
    activitat_id INT NOT NULL,
    numero INT NOT NULL,
    CHECK (numero > 0),
    UNIQUE (activitat_id, numero),
    FOREIGN KEY (activitat_id) REFERENCES activitats(id)
) ENGINE=InnoDB;

CREATE TABLE partides (
    id INT PRIMARY KEY,
    ronda_id INT NOT NULL,
    participant_a INT NOT NULL,
    participant_b INT NOT NULL,
    resultat ENUM('A', 'B', 'E') NULL,
    CHECK (participant_a <> participant_b),
    FOREIGN KEY (ronda_id) REFERENCES rondes(id),
    FOREIGN KEY (participant_a) REFERENCES inscripcions(id),
    FOREIGN KEY (participant_b) REFERENCES inscripcions(id)
) ENGINE=InnoDB;

INSERT INTO jocs (id, nom) VALUES
    (1, 'Ajedrez'),
    (2, 'Damas'),
    (3, 'Juego de cartas');

INSERT INTO activitats (id, joc_id, titol, tipus, estat, data, lloc, places)
VALUES
    (1, 3, 'Tarde de juegos', 'trobada', 'oberta',
     '2026-11-12', 'Local de la asociación', 16),
    (2, 1, 'Liga de demostración', 'torneig', 'en_curs',
     '2026-11-19', 'Local de la asociación', 4),
    (3, 2, 'Torneo de damas', 'torneig', 'oberta',
     '2026-11-26', 'Biblioteca', 8);

INSERT INTO inscripcions (id, activitat_id, alias) VALUES
    (1, 2, 'Aina'),
    (2, 2, 'Biel'),
    (3, 2, 'Cris'),
    (4, 2, 'Dani');

INSERT INTO rondes (id, activitat_id, numero) VALUES
    (1, 2, 1),
    (2, 2, 2),
    (3, 2, 3);

INSERT INTO partides
    (id, ronda_id, participant_a, participant_b, resultat)
VALUES
    (1, 1, 1, 2, 'A'),
    (2, 1, 3, 4, 'E'),
    (3, 2, 1, 3, NULL),
    (4, 2, 2, 4, NULL),
    (5, 3, 1, 4, NULL),
    (6, 3, 2, 3, NULL);

-- Cuenta de solo lectura para PHP-FPM y la API Node.
-- La clave se escribe al ejecutarlo; no se guarda en Git.
-- CREATE USER 'portal_lectura'@'localhost' IDENTIFIED BY '...';
-- GRANT SELECT ON puntdejoc.* TO 'portal_lectura'@'localhost';

-- Verificación
SELECT 'jocs' AS tabla, COUNT(*) AS registros FROM jocs
UNION ALL SELECT 'activitats', COUNT(*) FROM activitats
UNION ALL SELECT 'inscripcions', COUNT(*) FROM inscripcions
UNION ALL SELECT 'rondes', COUNT(*) FROM rondes
UNION ALL SELECT 'partides', COUNT(*) FROM partides;
