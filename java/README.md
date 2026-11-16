# Etapa 4 · Gestor de torneos en Java

## Qué es
Aplicación Java entregada cerrada en `tornejos.war`. Consulta los torneos que no están en borrador, muestra sus rondas y partidas y registra el resultado (A, B, E o pendiente) de las partidas de torneos en curso. No hay que programar ni reconstruir el WAR.

Recorrido: navegador → Tomcat (127.0.0.1:8080) → JDBC → MariaDB (127.0.0.1:3306, base `puntdejoc`). El portal PHP lee las mismas tablas, así que el ranking refleja los cambios sin volver a introducirlos. Apache, PHP-FPM y MariaDB se mantienen; Tomcat es un servicio aparte.

## Artefacto
| Archivo | Descripción |
|---|---|
| `tornejos.war` | Aplicación que se despliega (Jakarta Servlet 6.0, incluye MariaDB Connector/J 3.5.11) |
| `tornejos.xml.example` | Contexto de Tomcat con las entradas JNDI, sin contraseña real |
| `THIRD-PARTY.md` | Procedencia y licencia del controlador JDBC |

Versión del WAR (SHA-256), comprobar con `sha256sum tornejos.war`:

```
9777a16281051ab6a289939abd364edc2583544c3c26edb9571a4407e30db336
```

## Requisitos
- JDK 17 o 21
- Apache Tomcat 10.1 (`tomcat10` en Ubuntu, `tomcat` en Fedora)
- MariaDB con la base `puntdejoc` cargada según [../bdd/MODEL-DADES.md](../bdd/MODEL-DADES.md)

| | Ubuntu (`tomcat10`) |
|---|---|
| Configuración | `/etc/tomcat10/` |
| Contextos | `/etc/tomcat10/Catalina/localhost/` |
| Despliegue | `/var/lib/tomcat10/webapps/` |
| Registros | `/var/log/tomcat10/` (`catalina.out`, `localhost.*.log`, `localhost_access_log.*.txt`) |

## Despliegue

### 1. Tomcat solo en local
En `/etc/tomcat10/server.xml`, añadir `address="127.0.0.1"` al conector del puerto 8080:

```xml
<Connector port="8080" address="127.0.0.1" protocol="HTTP/1.1" ... />
```

### 2. Cuenta de MariaDB para Java
Con `sudo mariadb`, una cuenta propia (no root ni la cuenta PHP) con SELECT en la base y UPDATE solo de `resultat`:

```sql
CREATE USER 'tornejos_java'@'localhost' IDENTIFIED BY 'contraseña-propia';
GRANT SELECT ON puntdejoc.* TO 'tornejos_java'@'localhost';
GRANT UPDATE (resultat) ON puntdejoc.partides TO 'tornejos_java'@'localhost';
```

### 3. Configuración JNDI fuera del WAR
Copiar el ejemplo, poner la contraseña de la cuenta y proteger el archivo:

```sh
sudo cp tornejos.xml.example /etc/tomcat10/Catalina/localhost/tornejos.xml
sudo nano /etc/tomcat10/Catalina/localhost/tornejos.xml
sudo chown root:tomcat /etc/tomcat10/Catalina/localhost/tornejos.xml
sudo chmod 640 /etc/tomcat10/Catalina/localhost/tornejos.xml
```

El archivo real **no se sube a Git** (está en `.gitignore`). Si la contraseña contiene `&`, `<` o `"`, hay que escaparlos en XML.

### 4. Publicar el WAR
El nombre `tornejos.war` determina el contexto `/tornejos`. No se copia a la raíz de Apache.

```sh
sudo cp tornejos.war /var/lib/tomcat10/webapps/
sudo systemctl restart tomcat10
```

### 5. Comprobar
- `ss -ltn | grep 8080` muestra `127.0.0.1:8080`.
- http://127.0.0.1:8080/tornejos/ muestra el torneo 2 con 3 rondas y 6 partidas.
- Con la partida 3 pendiente, el PHP muestra Aina 3, Cris 1, Dani 1, Biel 0. Al guardar victoria B en esa partida, Cris pasa a 4. Reiniciar Tomcat no borra el resultado.
- `/tornejos/WEB-INF/web.xml` devuelve 404: ni la configuración ni las librerías se descargan por HTTP.

## Errores habituales
| Código | Significado | Dónde mirar |
|---|---|---|
| 400 | Parámetros no válidos | — |
| 403 | Acceso no local o token de sesión inválido | — |
| 404 | Torneo o ruta inexistente | `localhost_access_log.*.txt` |
| 409 | Partida no modificable (torneo no en curso) | — |
| 503 | Configuración o consulta fallida | `sudo grep -v '^\s*at ' /var/log/tomcat10/localhost.*.log \| tail` |

`Access denied for user 'tornejos_java'` en el log indica que la contraseña de `tornejos.xml` no coincide con la de MariaDB: corregir una de las dos y reiniciar Tomcat.

## Alcance
Prototipo docente sin login: solo acepta peticiones desde loopback. No publicarlo ni ponerlo detrás de un proxy sin añadir autenticación. No genera rondas ni emparejamientos; el ranking se consulta en el portal PHP.
