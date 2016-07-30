<?php
// We want to see errors during debugging
error_reporting(E_ALL);
ini_set('display_errors', '1');

// We need to use some WordPress functions
require( '../../../wp-load.php' );

// And we need our wrapper!
require( 'api.php' );

// Initialise our wrapper
$api = new Acuity_API();