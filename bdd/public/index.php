<?php
require __DIR__ . '/../src/funciones.php';
try {
    $pdo=db();
    $activitats=$pdo->query("SELECT id,titol,tipus,estat FROM activitats WHERE estat <> 'borrador' ORDER BY id")->fetchAll();
    $participants=$pdo->query('SELECT id,alias FROM inscripcions WHERE activitat_id=2')->fetchAll();
    $partides=$pdo->query('SELECT p.* FROM partides p JOIN rondes r ON r.id=p.ronda_id WHERE r.activitat_id=2 ORDER BY r.numero,p.id')->fetchAll();
    $ranking=classificacio($participants,$partides);
} catch (PDOException $e) {
    error_log($e->getMessage()); http_response_code(503);
    exit('No se puede consultar la base de datos. Comprueba el servicio, las credenciales y el registro del servidor.');
}
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Punto de Juego · Base de datos</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<nav>
<a href="/index.html">Inicio</a>
<a href="/portal/activitats.html">Actividades</a>
<a href="/portal/torneig.html">Torneo</a>
<a href="/portal/PHP/index.php">Actividades Dinamico</a>
<a href="/bdd/" aria-current="page">Base de datos</a>
</nav>
<main>
<h1>Punto de Juego</h1>
<p>Datos leídos de MariaDB en cada petición.</p>
<h2>Actividades</h2>
<?php foreach ($activitats as $a): ?>
<article>
<h3><?= h($a['titol']) ?></h3>
<p><?= h(['trobada'=>'Encuentro','torneig'=>'Torneo'][$a['tipus']]) ?> · <?= h(['oberta'=>'Inscripción abierta','en_curs'=>'En curso','finalitzada'=>'Finalizada'][$a['estat']] ?? $a['estat']) ?></p>
</article>
<?php endforeach; ?>
<h2>Clasificación del torneo de demostración</h2>
<table>
<caption>Victoria 3 puntos, empate 1, derrota 0; las pendientes no cuentan</caption>
<tr><th>Posición</th><th>Alias</th><th>Jugadas</th><th>V</th><th>E</th><th>D</th><th>Puntos</th></tr>
<?php foreach ($ranking as $r): ?>
<tr><?php foreach (['posicio','alias','jugades','victories','empats','derrotes','punts'] as $key): ?><td><?= h((string)$r[$key]) ?></td><?php endforeach; ?></tr>
<?php endforeach; ?>
</table>
<p><a href="resultats.php">Laboratorio local: registrar resultados</a></p>
</main>
<footer>DAW2 · AEA2 · RA1</footer>
</body>
</html>
