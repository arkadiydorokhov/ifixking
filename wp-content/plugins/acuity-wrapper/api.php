<?php

define('AQUITY__PLUGIN_DIR', plugin_dir_path(__FILE__));
require_once(AQUITY__PLUGIN_DIR . 'sdk.php');

class Acuity_API
{
    protected $userId = '12562561';
    protected $apiKey = '4783fa38dc0f50993be414f9330e09fb';

    public function getAppointments()
    {
        $userId = $this->userId;
        $apiKey = $this->apiKey;

        $acuity = new AcuityScheduling([
            'userId' => $userId,
            'apiKey' => $apiKey,
        ]);

        $appointments = $acuity->request('/appointments');
        print_r($appointments);
    }

    public function createAppointment()
    {
        $userId = $this->userId;
        $apiKey = $this->apiKey;

        $acuity = new AcuityScheduling([
            'userId' => $userId,
            'apiKey' => $apiKey,
        ]);

        $appointments = $acuity->request('/appointments');
        print_r($appointments);
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

    public function __construct()
    {
        return $this->getAppointments();
    }
}