<?php
/*
Plugin Name: CSS AutoLoader
Plugin URI: http://smartware.cc/free-wordpress-plugins/css-autoloader/
Description: This Plugin allows you to load additional CSS files without the need to change files in the Theme directory. To load additional CSS files just put them into a directory named cssautoload.
Version: 1.1
Author: smartware.cc, Peter's Plugins
Author URI: http://smartware.cc
Text Domain: css-autoloader
License: GPL2
*/

/*  Copyright 2015 Peter Raschendorfer (email : sw@smartware.cc)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Swcc_Css_Autoloader {
  
  public $plugin_name;
  public $plugin_slug;
  public $version;
  public $media;

  public function __construct() {
    $this->plugin_name = 'CSS AutoLoader';
    $this->plugin_slug = 'css-autoloader';
		$this->version = '1.1';
    // allowed media types
    $this->media = array( '' => 'all', '/all' => 'all', '/braille' => 'braille', '/embossed' => 'embossed', '/handheld' => 'handheld', '/print' => 'print', '/projection' => 'projection', '/screen' => 'screen', '/speech' => 'speech', '/tty' => 'tty', '/tv' => 'tv' );
    $this->init();
  }
  
  private function init() {
    add_action( 'wp_enqueue_scripts', array( $this, 'cssautoloader' ), 999 );
    add_action( 'admin_init', array( $this, 'add_text_domains' ) );
    add_action( 'admin_menu', array( $this, 'adminmenu' ) );
  }
  
  // init frontend
  function cssautoloader() {
    foreach ( $this->getAllFiles() as $file ) {
      wp_enqueue_style( 'cssautoloader-' . md5( $file['name'] ), $file['url'], array(), $file['version'], $file['media'] );
    }
  }

  // init backend
  function adminmenu() {
    add_management_page( 'WP CSS AutoLoader', 'CSS AutoLoader', 'activate_plugins', 'wpcssautoloader', array( $this, 'showadmin' ) );
  }
  
  // addd text domains
  function add_text_domains() {  
    load_plugin_textdomain( 'css-autoloader' );
  }
  
  // get an array of possible directories
  function getDirs() {
    $autoloaddir = '/cssautoload';
    $possibledirs = array();
    $possibledirs['general'] = array( 'dir' => WP_CONTENT_DIR . $autoloaddir, 'url' => content_url() . $autoloaddir );
    $possibledirs['theme'] = array( 'dir' => get_template_directory() . $autoloaddir, 'url' => get_template_directory_uri() . $autoloaddir );
    if ( is_child_theme() ) {
      $possibledirs['childtheme'] =  array( 'dir' => get_stylesheet_directory() . $autoloaddir, 'url' => get_stylesheet_directory_uri() . $autoloaddir );
    } else {
      $possibledirs['childtheme'] = false;
    }
    return $possibledirs;
  }
  
  // get an sorted array of all *.css files in all possible loactions 
  function getAllFiles() {
    $autoloaddir = '/cssautoload';
    $possibledirs = $this->getDirs();
    $files = array();
    foreach ( $possibledirs as $pdir ) {
      if ( $pdir ) {
        if ( is_dir( $pdir['dir'] ) ) {
          foreach ( $this->media as $mdir => $media ) {
            $curdir = $pdir['dir'] . $mdir;
            if ( is_dir( $curdir ) ) {
              foreach ( scandir( $curdir ) as $file ) {
                if ( $file !== '.' && $file !== '..' && !is_dir( $curdir . '/' . $file ) && substr( $file, 0, 1 ) != '_' && '.css' == strtolower( substr( $file, -4 ) ) ) {
                  $files[] = array( 'name' => $curdir . '/' . $file, 'url' => $pdir['url'] . $mdir . '/' . $file, 'file' => $file, 'media' => $media, 'version' =>  date( 'U', filemtime( $curdir . '/' . $file ) ) );
                }
              }
            }
          }
        }
      }
    }
    return $files;
  }
  
  // show admin page
  function showadmin() {
    if ( !current_user_can( 'activate_plugins' ) )  {
      wp_die( ___( 'You do not have sufficient permissions to access this page.' ) );
    }
    $possibledirs = $this->getDirs();
    ?>
    <div class="wrap">
      <?php screen_icon( 'tools' ); ?>
      <h2><?php _e( 'Load additional CSS files', 'css-autoloader'); ?></h2>
      <div id="poststuff">
        <div id="post-body" class="metabox-holder columns-2">
          <div id="post-body-content">
            <div class="meta-box-sortables ui-sortable">
              <div class="postbox">
                <div class="inside">
                  <p style="line-height: 32px; padding-left: 40px; background-image: url(<?php echo plugins_url( 'pluginicon.png', __FILE__ ); ?>); background-repeat: no-repeat;"><?php echo $this->plugin_name; ?> Version <?php echo $this->version; ?></p>
                </div>
              </div>
              <div class="postbox">
                <div class="inside">
                  <p><strong><?php _e( 'Possible paths to store your CSS files', 'css-autoloader'); ?></strong></p>
                  <hr />
                  <p><strong><?php _e( 'General Directory', 'css-autoloader'); ?></strong></p>
                  <p><?php echo __( 'Current Path', 'css-autoloader' ) . ': <code>' . $possibledirs['general']['dir']; ?></code></p>
                  <p><strong><?php _e( 'Theme Directory', 'css-autoloader'); ?></strong></p>
                  <p><?php echo __( 'Current Path', 'css-autoloader' ) . ': <code>' . $possibledirs['theme']['dir']; ?></code></p>
                  <p><strong><?php _e( 'Child Theme Directory', 'css-autoloader'); ?></strong></p>
                  <p><?php 
                    if ( $possibledirs['childtheme'] ) {
                      echo __( 'Current Path', 'css-autoloader' ) . ': <code>' . $possibledirs['childtheme']['dir'] . '</code>';
                    } else {
                      _e( 'You are not using a Child Theme', 'css-autoloader' );
                    }
                  ?></p>
                </div>
              </div>
              <div class="postbox">
                <div class="inside">
                  <p><strong><?php _e( 'Currently loaded CSS files (in that order)', 'css-autoloader'); ?></strong></p>
                  <hr />
                  <?php $this->showcurrent(); ?>
                </div>
              </div>
            </div>
          </div>
          <?php { $this->show_meta_boxes(); } ?>
        </div>
        <br class="clear">
      </div>    
    </div>
    <?
  }

  // list cuurently loaded js files on admin page
  function showcurrent() {
    $filesarray = $this->getAllFiles();  
    if ( empty( $filesarray ) ) {
      echo '<p>' . __( 'no files loaded currently', 'css-autoloader' ) . '</p>';
    } else {
      echo '<table style="width: 100%"><tbody>';
      foreach ( $filesarray as $file ) {
        echo '<tr><td colspan="3"><strong><a href="' . $file['url'] . '">' . $file['url'] . '</a></strong></td></tr><tr><td style="width: 20px">&nbsp;</td><td>' . __( 'File', 'css-autoloader' ) . '</td><td><code>' . $file['name'] . '</code></td></tr><tr><td style="width: 20px">&nbsp;</td><td>' . __( 'Media', 'css-autoloader' ) . '</td><td><strong>' . $file['media'] .  '</strong></td></tr>';
      }
      echo '</tbody></table>';
    }
  }
  
  // show meta boxes
  function show_meta_boxes() {
    ?>
    <div id="postbox-container-1" class="postbox-container">
      <div class="meta-box-sortables">
        <div class="postbox">
          <h3><span><?php _e( 'Like this Plugin?', 'css-autoloader' ); ?></span></h3>
          <div class="inside">
            <ul>
              <li><div class="dashicons dashicons-wordpress"></div>&nbsp;&nbsp;<a href="https://wordpress.org/plugins/<?php echo $this->plugin_slug; ?>/"><?php _e( 'Please rate the plugin', 'css-autoloader' ); ?></a></li>
              <li><div class="dashicons dashicons-admin-home"></div>&nbsp;&nbsp;<a href="http://smartware.cc/free-wordpress-plugins/<?php echo $this->plugin_slug; ?>/"><?php _e( 'Plugin homepage', 'css-autoloader'); ?></a></li>
              <li><div class="dashicons dashicons-admin-home"></div>&nbsp;&nbsp;<a href="http://smartware.cc/"><?php _e( 'Author homepage', 'css-autoloader' );?></a></li>
              <li><div class="dashicons dashicons-googleplus"></div>&nbsp;&nbsp;<a href="http://g.smartware.cc/"><?php _e( 'Authors Google+ Page', 'css-autoloader' ); ?></a></li>
              <li><div class="dashicons dashicons-facebook-alt"></div>&nbsp;&nbsp;<a href="http://f.smartware.cc/"><?php _e( 'Authors facebook Page', 'css-autoloader' ); ?></a></li>
            </ul>
          </div>
        </div>
        <div class="postbox">
          <h3><span><?php _e( 'Need help?', 'css-autoloader' ); ?></span></h3>
          <div class="inside">
            <ul>
              <li><div class="dashicons dashicons-wordpress"></div>&nbsp;&nbsp;<a href="http://wordpress.org/plugins/<?php echo $this->plugin_slug; ?>/faq/"><?php _e( 'Take a look at the FAQ section', 'css-autoloader' ); ?></a></li>
              <li><div class="dashicons dashicons-wordpress"></div>&nbsp;&nbsp;<a href="http://wordpress.org/support/plugin/<?php echo $this->plugin_slug; ?>/"><?php _e( 'Take a look at the Support section', 'css-autoloader'); ?></a></li>
              <li><div class="dashicons dashicons-admin-comments"></div>&nbsp;&nbsp;<a href="http://smartware.cc/contact/"><?php _e( 'Feel free to contact the Author', 'css-autoloader' ); ?></a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <?php
  }
}

$swccCssAutoloader = new Swcc_Css_Autoloader();
?>