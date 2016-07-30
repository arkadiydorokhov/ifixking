function alexSetValue(field, value) {


    //alert('setting ' + field + ' to ' + value);

    // var f = 'field:' + field;


    //var v = document.getElementsByName('field:' + field)[0].value;
    //alert(v);

    //alert(jQuery('[name="' + f + '"]').val());

    //alert(jQuery("input[name='field:1917299']").val());

    //jQuery('[name="' + f + '"]').val(value);

    //alert(jQuery('[data-field-id="' + field + '"]').val());


    var v = jQuery("#acuity-iframe").contents().find('#appointment-form > input[name="field:1917296"]').val();

    alert('the value is ' + v);

}

