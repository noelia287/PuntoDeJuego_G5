import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createPortalServer } from './server.js';

async function withServer(query, run) {
  const server = createPortalServer(query, () => {});
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise(resolve => server.close(resolve)); }
}
test('GET devuelve JSON, sirve el cliente y protege archivos privados', async () => {
  const activity = { id: 2, titulo: '<script>texto</script>', tipo: 'torneig', estado: 'en_curs' };
  await withServer(async () => [activity], async base => {
    const response = await fetch(`${base}/api/actividades`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.deepEqual(await response.json(), { actividades: [activity] });
    const html = await fetch(base);
    assert.equal(html.status, 200);
    assert.match(await html.text(), /cliente.js/);
    for (const path of ['/.env', '/index.js', '/server.js', '/no-existe']) {
      assert.equal((await fetch(base + path)).status, 404);
    }
    const denied = await fetch(`${base}/api/actividades`, { method: 'POST' });
    assert.equal(denied.status, 405);
    assert.equal(denied.headers.get('allow'), 'GET');
  });
});
test('Un fallo del gestor devuelve 503 sin filtrar detalles internos', async () => {
  await withServer(async () => { throw new Error('password=secreto'); }, async base => {
    const response = await fetch(`${base}/api/actividades`);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'No se pueden consultar las actividades.' });
  });
});
