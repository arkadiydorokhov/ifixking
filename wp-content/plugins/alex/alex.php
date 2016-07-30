<?php
/*
Plugin Name: Alex's Acuity Online Appointment Scheduling
Plugin URI: http://AcuityScheduling.com
Description: Embed <a href="https://acuityscheduling.com">Acuity Online Appointment Scheduling</a> into your site.  The tag to embed is: <code>[scheduling site="https://mysite.acuityscheduling.com"]</code>
Version: 1.1.1
Author: Acuity Scheduling
Author URI: http://AcuityScheduling.com
*/

/**
 * Embed Acuity Scheduling iframe like:
 * <iframe src="https://acuityscheduling.com/schedule.php?owner=1234567890" width="100%" height="600"></iframe>
 */
function embed_alex($atts)
{
    extract(shortcode_atts([
        'site'   => 'http://AcuityScheduling.com/',
        'width'  => '100%',
        'height' => 600,
        'border' => 0,
    ], $atts));

    return '<iframe src="http://app.acuityscheduling.com/schedule.php?owner=12562561&field:1917296=Wonderful" width="100%" height="800" frameBorder="0" id="acuity-iframe"></iframe>
            <script src="https://d3gxy7nm8y4yjr.cloudfront.net/js/embed.js" type="text/javascript"></script>';

    return "<iframe src=\"$site\" width=\"$width\" height=\"$height\" frameBorder=\"$border\"></iframe>
	        <script src=\"https://d3gxy7nm8y4yjr.cloudfront.net/js/embed.js\" type=\"text/javascript\"></script>";
}


function alex_add_scripts()
{
    wp_register_script('alex-script', plugins_url('alex/alex.js'));

    wp_enqueue_script("jquery");
    wp_enqueue_script('alex-script');
}

add_action('wp_enqueue_scripts', 'alex_add_scripts');
add_action('include_alex', 'embed_alex');

add_shortcode('alex', 'embed_alex');