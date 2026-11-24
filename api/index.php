<?php

/**
 * Vercel entrypoint (vercel-php runtime).
 *
 * Vercel routes every request here; the real front controller is
 * Laravel's own public/index.php. Telling PHP which script was called
 * keeps Laravel's URL generation and asset paths correct behind the
 * serverless proxy.
 */
$frontController = dirname(__DIR__).'/public/index.php';

$_SERVER['SCRIPT_FILENAME'] = $frontController;
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

require $frontController;
