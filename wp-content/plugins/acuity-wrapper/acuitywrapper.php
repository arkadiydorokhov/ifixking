<?php

/*
Plugin Name: Acuity Wrapper
Plugin URI: http://AcuityScheduling.com
Description: Allows you to place appointments to <a href="https://acuityscheduling.com">Acuity Online Appointment Scheduling</a>.  The tag to embed is: <code>[acuity]</code>
Version: 1.1.0
Author: Alex
Author URI: http://AcuityScheduling.com
*/

define('AQUITY__PLUGIN_DIR', plugin_dir_path(__FILE__));
require_once(AQUITY__PLUGIN_DIR . 'widget.php');

function embed_acuity_widget($atts)
{
    the_widget('Acuity_Widget');
}

add_shortcode('acuity', 'embed_acuity_widget');


