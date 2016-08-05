<?php

class AcuityWrapper
{
    protected $adapter = null;

    public function __construct($userId = null, $apiKey = null)
    {
        $userId = '12562561';
        $apiKey = '4783fa38dc0f50993be414f9330e09fb';

        $this->adapter = load_class(AcuitySDK::class, $userId, $apiKey);
    }

    public function getAppointments()
    {
        $appointments = $this->adapter->request('/appointments');
        print_r(json_encode($appointments));
    }

    public function createAppointment($data)
    {
        $response = $this->adapter->request('/appointments?admin=false', [
            'method' => 'POST',
            'data'   => $data,
        ]);

        if (isset($response['status_code']) && $response['status_code'] != 200) {
            throw load_class(AcuityException::class, $response['message'], $response['error']);
        }

        return $response;
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