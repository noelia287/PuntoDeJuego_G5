# Modelo de datos que debéis implementar en SQL
MariaDB con utf8mb4. Base: puntdejoc. Mantened los nombres internos para que el código pueda consultar las tablas.

| Tabla | Campos y restricciones |
|---|---|
| jocs | id INT PK, nom VARCHAR(100) obligatorio y único |
| activitats | id INT PK, joc_id FK jocs, titol VARCHAR(150), tipus ENUM(trobada,torneig), estat ENUM(borrador,oberta,en_curs,finalitzada), data DATE, lloc VARCHAR(150), places INT positivo |
| inscripcions | id INT PK, activitat_id FK activitats, alias VARCHAR(60), UNIQUE(activitat_id,alias) |
| rondes | id INT PK, activitat_id FK activitats, numero INT positivo, UNIQUE(activitat_id,numero) |
| partides | id INT PK, ronda_id FK rondes, participant_a y participant_b FK inscripcions, resultat ENUM(A,B,E) admite NULL; CHECK participant_a <> participant_b |

Todos los campos salvo resultat son NOT NULL. IDs explícitos en este prototipo. Sin borrado en cascada. Las claves foráneas no garantizan que las inscripciones pertenezcan al torneo ni que cada participante juegue una sola vez por ronda. Esas reglas necesitarían validación adicional en la aplicación o un diseño que las garantice. En RA1 las partidas ya están preparadas y solo se editan resultados.

Valores internos: trobada = encuentro; torneig = torneo; oberta = inscripción abierta; en_curs = en curso; finalitzada = finalizada.

## Datos que debéis cargar con INSERT
- Juegos: (1, Ajedrez), (2, Damas), (3, Juego de cartas).
- Actividad 1: encuentro abierto del juego 3, 16 plazas. Actividad 2: torneo en curso del juego 1, 4 plazas. Actividad 3: torneo abierto del juego 2, 8 plazas. Usad fechas y lugares ficticios.
- Inscripciones del torneo 2: IDs 1 Aina, 2 Biel, 3 Cris, 4 Dani.
- Rondas del torneo 2: IDs y números 1, 2, 3.
- Partidas (id,ronda,a,b,resultado): (1,1,1,2,A), (2,1,3,4,E), (3,2,1,3,NULL), (4,2,2,4,NULL), (5,3,1,4,NULL), (6,3,2,3,NULL).

## Ejercicios
1. Revisad las sentencias CREATE TABLE del Markdown de apoyo disponible en el encargo, relacionadlas con el modelo y justificad su orden de dependencias.
2. Cargad datos con INSERT y verificadlos con SELECT.
3. Consultad participantes del torneo 2, partidas pendientes y actividades abiertas.
4. Cambiad el resultado de la partida 3 con UPDATE y comprobad la clasificación en el navegador.
5. Comprobad que se rechazan una FK inexistente y una partida contra uno mismo.
6. Explicad qué reglas no garantiza el esquema.

