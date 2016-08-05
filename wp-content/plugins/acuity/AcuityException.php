<?php

class AcuityException extends Exception
{
    private static $codes = [
        'required_first_name'                => 'Attribute "firstName" is required.',
        'required_last_name'                 => 'Attribute "lastName" is required.',
        'required_email'                     => 'Attribute "email" is required.',
        'invalid_email'                      => 'Invalid "email" attribute value.',
        'invalid_fields'                     => 'The field "1" does not exist on this appointment.',
        'required_field'                     => 'The field "4" is required.',
        'required_appointment_type_id'       => 'The parameter "appointmentTypeID" is required.',
        'invalid_appointment_type'           => 'The appointment type "987654321" does not exist.',
        'invalid_calendar'                   => 'The calendar "987654321" does not exist.',
        'required_datetime'                  => 'The parameter "datetime" is required.',
        'invalid_timezone'                   => 'Invalid timezone "Aint/No_Timezone".',
        'invalid_datetime'                   => 'The datetime "asdf" is invalid.',
        'no_available_calendar'              => 'We could not find an available calendar.',
        'not_available_min_hours_in_advance' => 'The time "2016-01-05T16:00:00-0800" is not far enough in advance.',
        'not_available_max_days_in_advance'  => 'The time "2017-02-07T16:00:00" is too far in advance.',
        'not_available'                      => '',
    ];

    protected $acuityCode = null;

    public function __construct($message, $acuityCode = null, Exception $previous = null)
    {
        if (isset(self::$codes[$acuityCode])) {
            $this->acuityCode = $acuityCode;
        }

        parent::__construct($message, 0, $previous);
    }

    public function getAcuityCode()
    {
        return $this->acuityCode;
    }

    public function setAcuityCode($acuityCode)
    {
        $this->acuityCode = $acuityCode;

        return $this;
    }
}