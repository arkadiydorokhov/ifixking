<?php

/*
 *  API wrapper interface
 *
 *  Generate responses to drive the UI
 *  TODO: use Acuity API SDK
 *
 */

class AcuityScheduleController
{
    protected $api;
    protected $settings;
    const URL = 'https://ifixking.acuityscheduling.com/schedule.php';

    public function __construct($settings = null)
    {
        $this->api = load_class('AcuityWrapper');
        $this->settings = $settings ?: acuity_load_settings();
    }

    public function acuity_handle_schedule()
    {
        $inputs = $_REQUEST;

        if (! isset($inputs['command'])) {
            self::respond(0);
        }

        switch ($inputs['command']) {
            case 'showCalendar':
                $this->show_calendar($inputs);
                break;

            case 'getAddonsPartial':
                $this->getAddons($inputs);
                break;

            case 'availableTimes':
                $this->availableTimes($inputs);
                break;

            case 'checkConflict':
                $this->checkConflict($inputs);
                break;

            case 'validateEmail':
                $this->validateEmail($inputs);
                break;

            case 'getForms':
                $this->getForms($inputs);
                break;

            case 'confirm':
                $this->confirmViaAPI($inputs);
                break;

            case 'appt':
                $this->appt($inputs);
                break;
        }

        self::respond(0);
    }

    protected function confirmViaAPI($inputs)
    {
        //POST "https://acuityscheduling.com/api/v1/appointments"

        $customFields = array_intersect_key($inputs, array_flip($this->settings['CUSTOM_FIELDS']));

        $payload = [
            'appointmentTypeID' => $this->settings['CALENDAR_TYPE'],
            'calendarID'        => $this->settings['CALENDAR_ID'],
            'datetime'          => self::dateTime($inputs),
            'firstName'         => $inputs['firstName'],
            'lastName'          => $inputs['lastName'],
            'email'             => $inputs['email'],
            'fields'            => self::formatFields($inputs, $customFields),
            'noEmail'           => $this->settings['NO_SEND_EMAIL'],
            'admin'             => false,
            'timezone'          => $this->settings['TIMEZONE']
        ];

        try {
            $appointment = $this->api->createAppointment($payload);
            status_header(302);
            self::respond('');

        } catch (AcuityException $e) {
            status_header(400);

            self::respond(['message' => $e->getMessage(), 'code' => $e->getAcuityCode()]);
        }
    }

    private static function dateTime($input)
    {
        $time = strtotime($input['time'][0]);

        return '2016-08-15T09:00:00-0700';

        $objDateTime = new DateTime($time);

        return $objDateTime->format(DateTime::ISO8601);
    }

    private function formatFields($inputs, $fields)
    {
        return
            [
                [
                    "id"    => 1917296,
                    "value" => "Party time!",
                ],
            ];
    }

    protected function appt($inputs)
    {
        $owner = $this->settings['OWNER_ID'];

        $query = "?action=appt&owner=$owner&admin=&ajax=1";

//        ?action=appt
//    &owner=12562561
//    &id[]=ea174b14538f4a58091f9ae3504ca6ab
//    &admin=
//    &ajax=1
//    &PHPSESSID=riapofankt7gplucov3l26k206
//

        $fields = array_flip([
            'linkAppointmentType',
            'linkCalendar',
            'date',
            'time',
            'firstName',
            'lastName',
            'phone',
            'smsOptout',
            'email',
            'pay_later',
        ]);

        $body = array_intersect_key($inputs, $fields);
        $customFields = array_intersect_key($inputs, array_flip($this->settings['CUSTOM_FIELDS']));
        $body = array_merge($body, $customFields);

        $body['owner'] = $this->settings['OWNER_ID'];
        $body['appointmentType'] = $this->settings['CALENDAR_TYPE'];
        $body['calendar'] = $this->settings['CALENDAR_ID'];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function confirm($inputs = [])
    {
        $query = '?action=confirm&ajax=1&owner=' . $this->settings['OWNER_ID'];

        $fields = array_flip([
            'linkAppointmentType',
            'linkCalendar',
            'date',
            'time',
            'firstName',
            'lastName',
            'phone',
            'smsOptout',
            'email',
            'pay_later',
        ]);

        $body = array_intersect_key($inputs, $fields);
        $customFields = array_intersect_key($inputs, array_flip($this->settings['CUSTOM_FIELDS']));
        $body = array_merge($body, $customFields);

        $body['owner'] = $this->settings['OWNER_ID'];
        $body['appointmentType'] = $this->settings['CALENDAR_TYPE'];
        $body['calendar'] = $this->settings['CALENDAR_ID'];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function show_calendar($inputs = [])
    {
        $query = '?action=showCalendar&fulldate=1&owner=' . $this->settings['OWNER_ID'];

        $body = [
            'type'     => $this->settings['CALENDAR_TYPE'],
            'calendar' => $this->settings['CALENDAR_ID'],
            'skip'     => true,
        ];

        if (isset($inputs['month'])) {
            $body['month'] = $inputs['month'];
        }

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function getAddons($inputs = [])
    {
        self::respond('');
    }

    protected function availableTimes($inputs = [])
    {
        $query = '?action=availableTimes&showSelect=0&fulldate=1&owner=' . $this->settings['OWNER_ID'];

        $body = [
            'type'              => $this->settings['CALENDAR_TYPE'],
            'calendar'          => $this->settings['CALENDAR_ID'],
            'date'              => $inputs['date'],
            'ignoreAppointment' => '',
        ];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function checkConflict($inputs)
    {
        $query = '?action=checkConflict&owner=' . $this->settings['OWNER_ID'];

        $body = [
            'type'       => $this->settings['CALENDAR_TYPE'],
            'calendarID' => $this->settings['CALENDAR_ID'],
        ];

        $body['times'] = $inputs['times'];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function validateEmail($input = [])
    {
        $query = '?action=validateEmail&owner=' . $this->settings['OWNER_ID'];

        $fields = array_flip([
            'linkAppointmentType',
            'linkCalendar',
            'date',
            'time',
            'firstName',
            'lastName',
            'phone',
            'smsOptout',
            'email',
        ]);

        $body = array_intersect_key($input, $fields);
        $customFields = array_intersect_key($input, array_flip($this->settings['CUSTOM_FIELDS']));
        $body = array_merge($body, $customFields);

        $body['owner'] = $this->settings['OWNER_ID'];
        $body['appointmentType'] = $this->settings['CALENDAR_TYPE'];
        $body['calendar'] = $this->settings['CALENDAR_ID'];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function getForms($input = [])
    {
        $query = '?action=getForms&owner=' . $this->settings['OWNER_ID'];   //TODO: SID

        $body = [
            'owner'               => $this->settings['OWNER_ID'],
            'linkAppointmentType' => null,
            'linkCalendar'        => null,
            'appointmentType'     => $this->settings['CALENDAR_TYPE'],
            'calendar'            => $this->settings['CALENDAR_ID'],
            'date'                => $input['date'],
            'time'                => $input['time'],
            'firstName'           => '',
            'lastName'            => '',
            'phone'               => '',
            'smsOptout'           => 0,
            'email'               => '',
        ];

        $result = $this->call($query, $body);

        self::respond($result);
    }

    protected function call($query, $body, $method = 'POST')
    {
        if ($method == 'POST') {
            $response = wp_remote_post(self::URL . $query, ['body' => $body]);
        } else {
            $response = wp_remote_get(self::URL . $query, ['body' => $body]);
        }

        if (is_wp_error($response)) {
            echo $response->get_error_message();

            return false;
        }

        return $response['body'];
    }

    public static function respond($content)
    {
        if (is_array($content)) {
            $content = json_encode($content);
        }

        wp_die($content);
    }

    public static function register($class)
    {
        add_action('wp_ajax_acuity_handle_schedule_action', [$class, 'acuity_handle_schedule']);
        add_action('wp_ajax_nopriv_acuity_handle_schedule_action', [$class, 'acuity_handle_schedule']);
    }
}

