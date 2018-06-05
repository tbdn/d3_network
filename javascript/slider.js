
$( function() {
    $( "#timeSlider" ).slider({
        range: true,
        min: 0,
        max: 100,
        values: [ 0, 100 ],
        slide: function( event, ui ) {
            $( "#slider_range" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
    });
    $( "#slider_range" ).val($( "#timeSlider" ).slider( "values", 0 ) +
        " - " + $( "#timeSlider" ).slider( "values", 1 ) );
} );