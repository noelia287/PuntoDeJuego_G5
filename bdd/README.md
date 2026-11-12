# Etapa 3 · Punto de Juego con PHP y MariaDB

## Objetivo
Desplegar el portal sobre Apache y PHP-FPM, con datos persistentes en MariaDB. La teoría explica las opciones de arquitectura; el encargo 3 define el trabajo y las evidencias. La carpeta api-js se reserva para una próxima actividad; no se despliega en el encargo actual.

## Requisitos
PHP 8.2+ con PDO_MYSQL, Apache con integración FPM funcional y MariaDB local. Debéis instalar, configurar y verificar las dependencias en vuestro entorno.

## Estructura
- `public/`: única carpeta que debe publicarse mediante HTTP.
- `src/funciones.php`: conexión PDO, escapado y cálculo de clasificación.
- `MODEL-DADES.md`: contrato relacional y datos que debéis construir mediante SQL.
- `public/resultats.php`: ampliación futura; debe permanecer desactivada.

## Configuración requerida
El código consulta la base `puntdejoc` y utiliza DB_HOST, DB_PORT, DB_USER y DB_PASSWORD del entorno de FPM. La cuenta web solo necesita SELECT. Mantened ALLOW_LAB_WRITE desactivado (valor 0). Configurad el servicio que ejecuta la aplicación, no únicamente una terminal. No guardéis secretos en Git.

## Contrato funcional
Conservad los identificadores del modelo y el torneo ID 2. Las rondas ya están definidas: la aplicación calcula una clasificación, no genera emparejamientos. Victoria 3 puntos, empate 1, derrota 0; las pendientes no cuentan. Empates a puntos comparten posición y se muestran por alias. Son reglas didácticas, no un reglamento oficial de ajedrez.

## Trabajo del equipo
Revisad el modelo y usad el Markdown SQL descargable del encargo como apoyo para la creación y carga; elaborad las consultas y pruebas, desplegad solo public/, preparad la conexión y realizad las pruebas del encargo. El código PHP se proporciona; la prioridad es el despliegue y su justificación. Cada integrante debe demostrar el resultado en su ordenador.

## Próxima actividad · API
Consulta [API JavaScript con Node.js](api-js/README.md). Se trabajará más adelante para comparar HTML generado por PHP con datos JSON consumidos por el navegador; usa la misma base.
