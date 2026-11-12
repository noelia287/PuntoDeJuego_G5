const button = document.querySelector('#actualizar');
const status = document.querySelector('#estado');
const activities = document.querySelector('#actividades');
const types = { trobada: 'Encuentro', torneig: 'Torneo' };
const states = { oberta: 'Inscripción abierta', en_curs: 'En curso', finalitzada: 'Finalizada' };

async function loadActivities() {
  button.disabled = true;
  status.textContent = 'Consultando actividades…';
  activities.replaceChildren();
  try {
    const response = await fetch('/api/actividades', { cache: 'no-store' });
    if (!response.ok) throw new Error(`La API responde con HTTP ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.actividades)) throw new Error('Respuesta de la API no válida.');
    for (const activity of data.actividades) {
      const article = document.createElement('article');
      const title = document.createElement('h2');
      const detail = document.createElement('p');
      // Los textos recibidos se muestran como texto, nunca como HTML ejecutable.
      title.textContent = activity.titulo;
      detail.textContent = `${types[activity.tipo] ?? activity.tipo} · ${states[activity.estado] ?? activity.estado}`;
      article.append(title, detail);
      activities.append(article);
    }
    status.textContent = data.actividades.length ? 'Actividades actualizadas.' : 'No hay actividades disponibles.';
  } catch (error) {
    status.textContent = `${error.message} Revisa la API y vuelve a intentarlo.`;
  } finally {
    button.disabled = false;
  }
}
button.addEventListener('click', loadActivities);
loadActivities();
