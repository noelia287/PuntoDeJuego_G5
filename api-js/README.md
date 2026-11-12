# Ampliación · API JavaScript con Node.js

## Qué comparamos
- Portal PHP: Apache → PHP-FPM → MariaDB → respuesta HTML.
- Cliente de esta ampliación: navegador → Node.js → MariaDB → respuesta JSON; el JavaScript del navegador construye la lista.

Node.js ejecuta JavaScript en el servidor; `public/cliente.js` se ejecuta en el navegador. PHP-FPM no ejecuta la API JavaScript. Node escucha en otro puerto y usa la misma base y una cuenta con SELECT. No sustituye la entrega PHP ni requiere nuevas tablas.

## Requisitos y estructura
Node.js 22 o posterior, npm y MariaDB configurada según MODEL-DADES.md. La única dependencia es el conector oficial `mariadb`; el servidor HTTP utiliza la biblioteca de Node, sin Express.
- index.js: configuración y consulta al gestor.
- server.js: rutas HTTP y respuestas.
- public/: cliente mínimo que consume la API con fetch.
- .env.example: parámetros de referencia, sin contraseña real.
- server.test.js: pruebas HTTP con datos de prueba, sin base real.

## Trabajo de despliegue
Instalad las dependencias del proyecto con el archivo de bloqueo, preparad `.env` a partir del ejemplo con credenciales propias y arrancad el script start de package.json. El archivo .env no se sube a Git ni se copia bajo la raíz de Apache. Su entorno es independiente del pool PHP-FPM.

Abrir `http://127.0.0.1:3000/` y `http://127.0.0.1:3000/api/actividades` (o el puerto configurado). No abrir el HTML como file:// ni copiarlo al Apache del puerto 80: cliente y API se sirven desde Node en el mismo origen. Esta elección evita añadir CORS o un proxy en esta práctica. El proceso permanece activo mientras lo está el terminal; su arranque no lo gestiona PHP-FPM.

## Contrato HTTP
GET /api/actividades → 200, Content-Type application/json y `{ "actividades": [...] }`. Campos: id, titulo, tipo y estado. Se excluyen actividades en borrador.
Recurso inexistente → 404. Método distinto de GET → 405. Error de consulta → 503 con mensaje genérico y detalle en los logs del proceso.

## Pruebas
Comparad HTML inicial y respuesta JSON en Network. Cambiad un título por SQL con la cuenta de prácticas y actualizad la página PHP y este cliente. Deben reflejar el mismo dato. Detened MariaDB, comprobad el mensaje de error y recuperad el servicio. La API nunca debe permitir descargar .env ni su código.

Las pruebas automatizadas verifican HTTP con un repositorio simulado; no sustituyen la prueba real de conexión, permisos y datos en cada ordenador. Solo lectura y escucha 127.0.0.1 para el laboratorio, sin autenticación de usuarios finales. No es una versión para Internet.
