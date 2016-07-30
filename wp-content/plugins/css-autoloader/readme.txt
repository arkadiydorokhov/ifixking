=== CSS AutoLoader ===
Contributors: smartware.cc, petersplugins
Donate link: http://smartware.cc/make-a-donation/
Tags: css, style, styling, custom css, custom styles, custom stylesheet, custom stylesheets, load, autoload, header, wp_enqueue_style, wp_head 
Requires at least: 3.0
Tested up to: 4.4
Stable tag: 1.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Load CSS files without coding

== Description ==

> This Plugin allows you to load additional CSS files without the need to change the theme

See also [Plugin Homepage](http://smartware.cc/free-wordpress-plugins/css-autoloader/)

To load additional stylesheets just put them into a directory named **cssautoload** (case-sensitive!). This directory can be placed in three different locations that are loaded in the following order:

* Theme independent : in the `wp-content` directory
* Theme dependent : in the Theme's directory
* Child Theme dependent (if using a Child Theme) : in the Child Theme's directory

Only files with extension .css are added, all other files are ignored. Also files beginning with an underscore (_) are ignored.

= CSS for different media =

CSS allows to have different styles for different target devices. Files placed directly in the `cssautoload` directory are added with the media type 'all', suitable for all devices. To use a different media type just create a subdirectory with the name of the target media type (case-sensitive!). Te following CSS media types are supported according to the official CSS standard:

* `all` for all devices - you don't need to create the `all` directory, you also can put the files directly into the cssautoload root directory
* `braille` for braille tactile feedback devices
* `embossed` for paged braille printers
* `handheld` for handheld devices
* `print` for printouts or print preview on screen
* `projection` for projected presentations
* `screen` for screens
* `speech` for speech synthesizers
* `tty` for media using a fixed-pitch character grid
* `tv` for television-type devices

Other subdirectories in `cssautoload` directory are ignored. Also subdirectories in the media subdirectories are not supported.

= Languages =
 
* English
* German

**Translators welcome!** This plugin uses Language Packs and can be translated on [translate.wordpress.org](https://translate.wordpress.org/) (please [contact me](http://smartware.cc/contact/) if you want me to add creedits here).

= Do you like the CSS AutoLoader Plugin? =

Thanks, I appreciate that. You don't need to make a donation. No money, no beer, no coffee. Please, just [tell the world that you like what I'm doing](http://smartware.cc/make-a-donation/)! And that's all.

= More plugins from smartware.cc =

* **[JavaScript AutoLoader](https://wordpress.org/plugins/javascript-autoloader/)** - Load JavaScript files without changing files in the theme directory or installing several plugins to add all the desired functionality 
* **[hashtagger](https://wordpress.org/plugins/hashtagger/)** - Use #hashtags and @usernames in your posts
* **[404page](https://wordpress.org/plugins/404page/)** Define any of your WordPress pages as 404 error page 
* [See all](https://profiles.wordpress.org/smartwarecc/#content-plugins)

== Installation ==

= From your WordPress dashboard =

1. Visit 'Plugins' -> 'Add New'
1. Search for 'CSS AutoLoader'
1. Activate the plugin through the 'Plugins' menu in WordPress

= Manually from wordpress.org =

1. Download CSS AutoLoader from wordpress.org and unzip the archive
1. Upload the `jcss-autoloader` folder to your `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

== Screenshots ==

1. Go to 'Tools' -> 'CSS AutoLoader' in your WordPress dashboard to see the possible paths where to store your CSS files and the currently loaded files

== Changelog ==

= 1.1 (2015-12-15) =
* Added Language Pack Support for translations

= 1.0 (2015-09-28) =
* Initial Release

== Upgrade Notice ==

= 1.1 =
Added Language Pack Support for translations