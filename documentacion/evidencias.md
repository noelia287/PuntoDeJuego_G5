# Evidencias individuales · Noelia Gonzalez

Despliegue del portal estático de Punto de Juego con Apache HTTP Server en mi ordenador.

## 1. Sistema y versiones

| Elemento | Valor | Comando |
|---|---|---|
| Distribución | Zorin OS 18.1 (basada en Ubuntu 24.04 *noble*) | `cat /etc/os-release` |
| Kernel | 7.0.0-38-generic | `uname -r` |
| Apache HTTP Server | 2.4.58 (paquete `apache2` 2.4.58-1ubuntu8.17) | `apache2 -v`, `dpkg -l apache2` |
| Git | 2.43.0 | `git --version` |

Como Zorin OS está basada en Ubuntu, el paquete y el servicio se llaman `apache2`.

## 2. Servicio y configuración

| Elemento | Ubicación |
|---|---|
| Servicio | `apache2.service` |
| Puertos | `/etc/apache2/ports.conf` → `Listen 80` |
| Sitio activo | `/etc/apache2/sites-enabled/000-default.conf` → `DocumentRoot /var/www/html` |
| Raíz documental | `/var/www/html` |
| Registros | `/var/log/apache2/access.log` y `/var/log/apache2/error.log` |

```
$ systemctl status apache2
● apache2.service - The Apache HTTP Server
     Loaded: loaded (/usr/lib/systemd/system/apache2.service)
     Active: active (running) since Thu 2026-10-29 00:16:07 CET
   Main PID: 1234 (apache2)
```

```
$ ss -ltn | grep ':80 '
LISTEN 0      511                *:80               *:*
```

## 3. Ubicación del portal y URL local

- Copia de trabajo (repositorio): `/home/noelia/Descargas/M08/RA7/01-estatic`
- Ruta servida por Apache: `/var/www/html`
- URL local: **http://localhost/**

Los archivos tienen permisos `-rw-r--r--` y los directorios `drwxr-xr-x`, así que Apache puede leerlos y entrar en las carpetas.

## 4. Pruebas de páginas y recursos

| URL | Estado | Tipo de contenido |
|---|---|---|
| http://localhost/ | 200 | text/html |
| http://localhost/portal/activitats.html | 200 | text/html |
| http://localhost/portal/torneig.html | 200 | text/html |
| http://localhost/portal/style.css | 200 | text/css |

Petición del documento:

```
$ curl -I http://localhost/
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Ubuntu)
Content-Length: 835
Content-Type: text/html
```

Petición de un recurso:

```
$ curl -I http://localhost/portal/style.css
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Ubuntu)
Content-Length: 6709
Content-Type: text/css
```

## 5. Ruta inexistente

```
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost/noexiste.html
404
```

Apache no encuentra el archivo en `/var/www/html` y responde **404 Not Found**. El servidor funciona, lo que falla es el recurso pedido.

Registro en `access.log`:

```
::1 - - [29/Oct/2026:01:16:06 +0100] "GET /noexiste.html HTTP/1.1" 404 432 "-" "curl/8.5.0"
```

## 6. Comprobar que responde mi Apache

- El servicio `apache2` está activo y escucha en el puerto 80.
- `000-default.conf` sirve `/var/www/html`.
- El `index.html` de `/var/www/html` es igual al del repositorio (`diff` sin diferencias).
- Las peticiones hechas con `curl` aparecen en `/var/log/apache2/access.log`.
