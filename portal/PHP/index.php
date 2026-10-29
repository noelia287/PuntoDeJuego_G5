<?php
// Una lista de datos y un bucle: todavía no hay base de datos.
$activitats = [
    ['titol' => 'Tarde de juegos', 'tipus' => 'Encuentro'],
    ['titol' => 'Liga de demostración', 'tipus' => 'Torneo'],
];
function h(string $text): string { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Punto de Juego</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Actividades de Punto de Juego</h1>
<?php foreach ($activitats as $activitat): ?>
<article>
<h2><?= h($activitat['titol']) ?>
</h2>
<p><?= h($activitat['tipus']) ?>
</p>
</article>
<?php endforeach; ?>
<p>Respuesta generada en el servidor: <?= date('H:i:s') ?>
</p>
</body>
</html>
