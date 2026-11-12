import mariadb from 'mariadb';
import { createPortalServer } from './server.js';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, PORT = '3000' } = process.env;
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || DB_PASSWORD === 'CAMBIA_ESTA_CLAVE') {
  throw new Error('Configura la conexión en .env con una contraseña propia.');
}
function portNumber(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65535) {
    throw new Error('Puerto no válido.');
  }
  return Number(value);
}
const pool = mariadb.createPool({
  host: DB_HOST,
  port: portNumber(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: 'puntdejoc',
  connectionLimit: 3,
});
// Mismos datos que PHP, cuenta de lectura y consulta fija sin entradas del usuario.
const server = createPortalServer(async () => {
  const rows = await pool.query(
    "SELECT id, titol, tipus, estat FROM activitats WHERE estat <> 'borrador' ORDER BY id"
  );
  return rows.map(row => ({
    id: row.id,
    titulo: row.titol,
    tipo: row.tipus,
    estado: row.estat,
  }));
});
server.on('error', async error => {
  console.error('No se puede iniciar la API:', error.message);
  await pool.end();
  process.exitCode = 1;
});
// Laboratorio local: no publicar este prototipo sin control de acceso.
server.listen(portNumber(PORT), '127.0.0.1', () => {
  console.log(`Punto de Juego: http://127.0.0.1:${PORT}/`);
});
function shutdown() {
  server.close(async () => { await pool.end(); });
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
