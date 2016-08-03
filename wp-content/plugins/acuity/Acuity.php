<?php

/*
Plugin Name: Acuity
Plugin URI: http://AcuityScheduling.com
Description: Allows you to place appointments to <a href="https://acuityscheduling.com">Acuity Online Appointment Scheduling</a>.  The tag to embed is: <code>[acuity]</code>
Version: 1.1.0
Author: Alex
Author URI: http://AcuityScheduling.com
*/

function acuity_register_options()
{
    register_setting('ozh_sampleoptions_options', 'ozh_sample');
}

add_action('admin_init', 'acuity_register_options');

add_action('plugins_loaded', function () {

    load_class('AcuityForm');
    load_class('AcuityScheduleController');

    //$wrapper = load_class('AcuityWrapper');
});

/**
 *  Makeshift class loader
 *
 * @param $class
 * @return mixed
 */
function load_class($class)
{
    require_once(plugin_dir_path(__FILE__) . $class . '.php');

    $instance = new $class;
    $instance::register($instance);

    return $instance;
}

function acuity_load_settings($key = null)
{
    $settings = include plugin_dir_path(__FILE__) . 'app.php';

    if ($key) {
        return isset($settings[$key]) ? $settings[$key] : null;
    }

    return $settings;
}

function include_html($file)
{
    ob_start();
    include $file;
    return ob_get_clean();
}

function remote_request($url, $data)
{

    //wp_remote_post($url, $args = []);

    if (empty($url)) {
        return false;
    }

    $request = wp_remote_post($url);

    if (is_wp_error($request)) {
        echo $request->get_error_message();
        return false;
    }

    $data = json_decode($request['body']);

    if ($request['response']['code'] == 200) {
        return $data;
    } else {
        return false;
    }
}
