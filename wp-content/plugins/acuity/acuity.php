<?php

/*
Plugin Name: Acuity
Plugin URI: http://AcuityScheduling.com
Description: Allows you to place appointments to <a href="https://acuityscheduling.com">Acuity Online Appointment Scheduling</a>.  The tag to embed is: <code>[acuity]</code>
Version: 1.1.0
Author: Alex
Author URI: http://AcuityScheduling.com
*/

define('AQUITY__PLUGIN_DIR', plugin_dir_path(__FILE__));
require_once(AQUITY__PLUGIN_DIR . 'wrapper.php');

function handle_form()
{

    if (isset($_POST['cf-submitted'])) {

        $fields = [
            'firstName',
            'lastName',
            'phone',
            'smsOptout',
            'email',
        ];


        $firstName = sanitize_text_field($_POST["firstName"]);
        $lastName = sanitize_text_field($_POST["lastName"]);
        $email = sanitize_email($_POST["email"]);

        $result = (new wrapper())->createAppointment([
                'appointmentTypeID' => $_POST['appointmentTypeID'],
                'calendarID'        => $_POST['calendarID'],
                'datetime'          => $_POST['time'],
                'firstName'         => $_POST['firstName'],
                'lastName'          => $_POST['lastName'],
                'email'             => $_POST['email'],
            ]
        );

        if (isset($result['status_code']) && $result['status_code'] == 200) {

            wp_redirect('/done');
            exit();

        } else {
            echo 'An unexpected error occurred: ' . $result['message'];
        }
    }
}

function render_form3()
{
    //echo '<form action="' . esc_url($_SERVER['REQUEST_URI']) . '" method="post">';
    echo '<form action = "' . esc_url(admin_url('admin-post.php')) . '" method = "post" >';

    echo '<p>';
    echo 'Your Name (required) <br />';


    echo '<input type="text" name="cf-name" pattern="[a-zA-Z0-9 ]+" value="' . (isset($_POST["cf-name"]) ? esc_attr($_POST["cf-name"]) : '') . '" size="40" />';
    echo '</p>';
    echo '<p>';
    echo 'Your Email (required) <br />';
    echo '<input type="email" name="cf-email" value="' . (isset($_POST["cf-email"]) ? esc_attr($_POST["cf-email"]) : '') . '" size="40" />';
    echo '</p>';
    echo '<p>';
    echo 'Subject (required) <br />';
    echo '<input type="text" name="cf-subject" pattern="[a-zA-Z ]+" value="' . (isset($_POST["cf-subject"]) ? esc_attr($_POST["cf-subject"]) : '') . '" size="40" />';
    echo '</p>';
    echo '<p>';
    echo 'Your Message (required) <br />';
    echo '<textarea rows="10" cols="35" name="cf-message">' . (isset($_POST["cf-message"]) ? esc_attr($_POST["cf-message"]) : '') . '</textarea>';
    echo '</p>';

    echo '<input type="hidden" name="action" value="acuity_form">';

    echo '<p><input type="submit" name="cf-submitted" value="Send"/></p>';
    echo '</form>';
}

function render_form()
{
    echo '<form action = "' . esc_url(admin_url('admin-post.php')) . '" method = "post" >';
    include_once 'form.html';
    echo '</form>';
}

function acuity_shortcode()
{
    ob_start();

    //handle_form();
    render_form();

    return ob_get_clean();
}


function acuity_register_options()
{
    register_setting('ozh_sampleoptions_options', 'ozh_sample');
}

add_shortcode('acuity', 'acuity_shortcode');
add_action('admin_init', 'acuity_register_options');
add_action('admin_post_nopriv_acuity_form', 'handle_form');
add_action('admin_post_acuity_form', 'handle_form');

