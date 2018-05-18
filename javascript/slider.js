var slider = document.getElementById("timeSlider");
var output = document.getElementById("slider_output_test");
output.innerHTML = "Aktueller Slider Wert : " + slider.value;

slider.oninput = function() {
    console.log("FUNTKIONIERT : " + this.value);
    output.innerHTML = "Aktueller Slider Wert : " + this.value;
};