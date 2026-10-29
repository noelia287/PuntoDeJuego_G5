# Punto de Juego · Portal estático

Portal web de **Punto de Juego**, una asociación de juegos de mesa nacida en Mataró que organiza encuentros y torneos presenciales por la comarca del Maresme.

Esta es la primera versión del portal: una web estática (HTML y CSS) desplegada con **Apache HTTP Server** en el ordenador de cada integrante. Todas las actividades, rondas y clasificaciones son **datos ficticios de demostración**. No hay inscripciones ni resultados persistentes.

Práctica de DAW2 · M08 · AEA2.

## Integrantes

- Marc Cirio
- Aaron
- Noelia Gonzalez

## Estructura

```
.
├── index.html              # Página de inicio
├── portal/
│   ├── activitats.html     # Actividades
│   ├── torneig.html        # Rondas y clasificación del torneo
│   └── style.css           # Estilos comunes
├── documentacion/
│   ├── recursos.md         # Recursos necesarios y no necesarios en esta versión
│   └── evidencias.md       # Evidencias del despliegue
└── README.md
```

La web la forman `index.html` y la carpeta `portal/`. La carpeta `documentacion/` no se despliega.

## Requisitos

- Git
- Apache HTTP Server (`apache2` en Ubuntu, `httpd` en Fedora)
- Un navegador web

No hace falta PHP, MariaDB ni Apache Tomcat. El detalle está en [documentacion/recursos.md](documentacion/recursos.md).

## Despliegue

### 1. Clonar el repositorio

```sh
git clone https://github.com/noelia287/PuntoDeJuego_G5.git
cd PuntoDeJuego_G5
```

El repositorio es la copia de trabajo: se edita aquí y después se copia a la carpeta que sirve Apache.

### 2. Instalar y arrancar Apache HTTP Server

**Ubuntu**

```sh
sudo apt update
sudo apt install apache2
sudo systemctl enable --now apache2
systemctl status apache2
```

**Fedora**

```sh
sudo dnf install httpd
sudo systemctl enable --now httpd
systemctl status httpd
```

Antes de instalar, se puede comprobar si el puerto 80 ya está ocupado con `sudo ss -ltnp | grep ':80 '`.

### 3. Copiar el portal a la raíz documental

| | Ubuntu | Fedora |
|---|---|---|
| Servicio | `apache2` | `httpd` |
| Configuración | `/etc/apache2/` | `/etc/httpd/` |
| Raíz documental | `/var/www/html` | `/var/www/html` |
| Registros | `/var/log/apache2/` | `/var/log/httpd/` |

Solo se copian los archivos de la web (`index.html` y `portal/`). **No se copia la carpeta entera del repositorio**: `.git/`, `README.md` y `documentacion/` quedarían accesibles por HTTP.

Desde la carpeta del repositorio:

```sh
sudo cp -r index.html portal /var/www/html/
sudo chmod -R a+rX /var/www/html
```

El `index.html` del repositorio sustituye a la página por defecto de Apache.

En Fedora con SELinux, restaurar el contexto de los archivos copiados (sin desactivar SELinux):

```sh
sudo restorecon -Rv /var/www/html
```

### 4. Comprobar

Abrir en el navegador:

```
http://localhost/
```

O desde la terminal:

```sh
curl -I http://localhost/
curl -I http://localhost/portal/style.css
```

Ambas peticiones deben devolver `200 OK`, con tipo `text/html` y `text/css` respectivamente. Los accesos y errores quedan en `access.log` y `error.log` de la carpeta de registros.

### 5. Actualizar después de un cambio

```sh
git pull
sudo cp -r index.html portal /var/www/html/
```

### Prueba rápida sin Apache

Para revisar cambios sin desplegar:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

y visitar http://127.0.0.1:8000. Se detiene con Ctrl+C.

## Forma de trabajo

- Cada integrante trabaja en su clon con su propia identidad de Git (`user.name` y `user.email`).
- Antes de empezar se hace `git pull` para partir de la última versión.
- Commits pequeños y con mensajes que explican el cambio.
- No se suben credenciales ni se crean repositorios anidados.
