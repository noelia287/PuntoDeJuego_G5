# Recursos de la versión estática

Esta primera versión del portal de **Punto de Juego** es una web estática: solo contiene archivos HTML y CSS que el navegador interpreta directamente. El servidor no ejecuta código ni consulta datos. Únicamente entrega los archivos tal y como están en el disco.

## Archivos del proyecto

| Archivo | Función |
|---|---|
| `index.html` | Página de inicio del portal. Presenta la asociación y enlaza con el resto de páginas. |
| `portal/activitats.html` | Listado de actividades ficticias (encuentros y torneos). |
| `portal/torneig.html` | Rondas y clasificación del torneo de demostración (texto HTML fijo). |
| `portal/style.css` | Hoja de estilos común a todas las páginas. |
| `documentacion/` | Documentación del equipo. No forma parte de la web desplegada. |
| `README.md` | Descripción del proyecto, integrantes, estructura e instrucciones de despliegue. |

## Recursos que sí necesita

| Recurso | Para qué |
|---|---|
| Navegador web | Visualizar las páginas e inspeccionar las peticiones (herramientas de desarrollo, pestaña *Red*). |
| Editor de texto | Modificar el HTML y el CSS. |
| Git y cuenta de GitHub | Trabajar en equipo sobre el repositorio compartido y conservar el historial. |
| Apache HTTP Server | Servir los archivos por HTTP desde el propio ordenador. En Ubuntu es el paquete y servicio `apache2`, y en Fedora `httpd`. |
| Terminal y permisos de administrador (`sudo`) | Instalar Apache, gestionar el servicio y copiar el portal a la raíz documental. |
| `curl` (opcional) | Comprobar respuestas HTTP y cabeceras desde la terminal. |

Para una prueba rápida sin Apache también sirve `python3 -m http.server`, pero el despliegue de la práctica se hace con Apache HTTP Server.

## Recursos que todavía no necesita

| Recurso | Por qué no hace falta ahora |
|---|---|
| PHP (u otro lenguaje de servidor) | No hay código que se ejecute en el servidor: no hay formularios que procesar ni páginas generadas dinámicamente. |
| MariaDB / MySQL | No se guardan datos. Las actividades y la clasificación son texto escrito en el HTML. Cambiar un resultado no recalcula puntos. |
| Apache Tomcat | Es un contenedor de aplicaciones Java. Se usará cuando se despliegue la aplicación Java, no para servir archivos estáticos. |
| Módulos extra de Apache, certificados TLS o abrir puertos al exterior | La entrega se verifica en local (`http://localhost/`). No se publica el servicio fuera del equipo. |
| Credenciales o archivos de configuración con contraseñas | No hay base de datos ni servicios externos, así que no hay secretos que gestionar ni subir al repositorio. |

Instalar estos componentes ahora solo añadiría servicios que mantener y posibles puntos de fallo sin aportar ninguna funcionalidad a esta versión.
