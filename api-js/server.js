import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const publicFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/cliente.js', ['cliente.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
]);

// Recibe la consulta para poder probar HTTP sin depender de una base real.
export function createPortalServer(listActivities, logError = console.error) {
  return createServer(async (request, response) => {
    const json = (status, data) => {
      response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(JSON.stringify(data));
    };
    if (request.method !== 'GET') {
      response.setHeader('Allow', 'GET');
      json(405, { error: 'Método no permitido. Utiliza GET.' });
      return;
    }
    // Solo se sirven rutas explícitas: nunca código del servidor ni .env.
    const pathname = request.url.split('?')[0];
    if (pathname === '/api/actividades') {
      try {
        json(200, { actividades: await listActivities() });
      } catch (error) {
        logError(error);
        json(503, { error: 'No se pueden consultar las actividades.' });
      }
      return;
    }
    const file = publicFiles.get(pathname);
    if (!file) {
      json(404, { error: 'Recurso no encontrado.' });
      return;
    }
    try {
      const content = await readFile(new URL(`./public/${file[0]}`, import.meta.url));
      response.writeHead(200, {
        'Content-Type': file[1],
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(content);
    } catch (error) {
      logError(error);
      json(500, { error: 'No se puede servir la página.' });
    }
  });
}
