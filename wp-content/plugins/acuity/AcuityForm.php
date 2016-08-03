<?php

class AcuityForm
{
    protected $settings = [];

    public function __construct($settings = null)
    {
        $this->settings = $settings ?: acuity_load_settings();
    }

    public function render_form($query = [])
    {
        include_once 'html/calendar.html';
    }

    public function handle_form($input = [])
    {
        if (isset($input['cf-submitted'])) {

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

    function render_form4()
    {
        echo '<form action = "' . esc_url(admin_url('admin-post.php')) . '" method = "post" >';
        include_once 'form.html';
        echo '</form>';
    }

    public static function register($class)
    {
        wp_register_style('acuity-style', plugins_url('/css/acuity.css', __FILE__), [], '20120208', 'all');
        wp_register_script('acuity-bootstrap-script', plugins_url('/js/bootstrap.js', __FILE__), ['jquery'], 1, true);
        wp_register_script('acuity-schedule-script', plugins_url('/js/schedule.js', __FILE__), ['jquery'], 1, true);
        wp_register_script('acuity-settings-script', plugins_url('/js/settings.js', __FILE__), ['jquery'], 1, true);

        add_action('wp_enqueue_scripts', [$class, 'enqueue_scripts']);
        add_action('admin_post_nopriv_acuity_form', [$class, 'handle_form']);
        add_action('admin_post_acuity_form', [$class, 'handle_form']);
        add_shortcode('acuity', [$class, 'acuity_shortcode']);
    }

    public function enqueue_scripts()
    {
        wp_enqueue_script('acuity-settings-script');
        wp_enqueue_script('acuity-bootstrap-script');
        wp_enqueue_script('acuity-schedule-script');
        wp_enqueue_script('acuity-schedule-script');
        wp_enqueue_style('acuity-style');
    }

    public function acuity_shortcode()
    {
        ob_start();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->handle_form($_REQUEST);

        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->render_form($_REQUEST);
        }

        return ob_get_clean();
    }

}