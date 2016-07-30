<?php

define('AQUITY__PLUGIN_DIR', plugin_dir_path(__FILE__));
require_once(AQUITY__PLUGIN_DIR . 'sdk.php');

class wrapper
{
    protected $adapter = null;

    public function __construct($userId = null, $apiKey = null)
    {
        $userId = '12562561';
        $apiKey = '4783fa38dc0f50993be414f9330e09fb';

        $this->adapter = new AcuityScheduling([
            'userId' => $userId,
            'apiKey' => $apiKey,
        ]);
    }

    public function getAppointments()
    {
        $appointments = $this->adapter->request('/appointments');
        print_r(json_encode($appointments));
    }

    public function createAppointment($data)
    {
        $appointment = $this->adapter->request('/appointments', [
            'method' => 'POST',
            'data'   => $data,
        ]);

        return $appointment;
    }

    protected function remote_request($url)
    {
        if (empty($url)) {
            return false;
        }

        $request = wp_remote_request($url);

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

}