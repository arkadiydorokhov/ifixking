<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wp_acuity');

/** MySQL database username */
define('DB_USER', 'wp_user');

/** MySQL database password */
define('DB_PASSWORD', 'password1');

/** MySQL hostname */
define('DB_HOST', 'hack-station.local');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ' OWa1e5xUaK]HBi G}Dq42-J2}).IwPn ICIg]~ZsM!9vp<7wThzo+k3?5|g9$%F');
define('SECURE_AUTH_KEY',  'Pp^e?5k1Mq~$2he|C#xh4igm5(fjPiI+{{N|9_>+jb8uq*`fK.MrIfWI1ZXt.`mp');
define('LOGGED_IN_KEY',    'K]9<1rX[RX4.LvfDTj7zt{R}iTM}-iS$q=3RnbFmi^0%S&w{dMkF,CUoON+AX$)z');
define('NONCE_KEY',        '][#<&9^F5Yb87Nk+Y>~blzgE!1[ehWBHP),~9Oh}~<+qJ9yK20,x2o!-P(RE*/%<');
define('AUTH_SALT',        ';fyQBaQF(~wS#(r/-_]B#gQfh6Gta{k Zzl6GxaJ6s4F:e6-k0DjXi^sJFH6.ns)');
define('SECURE_AUTH_SALT', 'm$xjctK~nU_H3V2jEq|O6~h$~6Nm6]VqJMl8--/~loeXS~^9WqA@F>H^g>ed!`=J');
define('LOGGED_IN_SALT',   'v[NDzA6fi3:lx+Ak}/-x;V^Gzog.1[r1Zja!MqB+YWOtp|1z.>+(;BDNib~~w`|K');
define('NONCE_SALT',       '(<}={kpGDfZhS>ig-?<8{0@p;_w*!NU<bsAj 0C^)fw/i (j,)L!,lKg^7dH6`%B');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
