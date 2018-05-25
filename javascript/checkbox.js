$("input:checkbox").click(function() {
    if ($(this).is(":checked")) {
        var group;
        // add this to filter list
        console.log($(this)[0].value + " is checked");

        if(this.name == "layer5") {
            group = "input:checkbox[name='layer4']";
        } else {
            group = "input:checkbox[name='layer5']";
        }
        $(group).prop("checked", false);
        // clear all them filters because group is empty now

        $(this).prop("checked", true);
    } else {
        console.log($(this)[0].value + " is not checked");
        // remove this from filter list
        $(this).prop("checked", false);
    }
});