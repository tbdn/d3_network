$("input:checkbox").click(function() {
    if ($(this).is(":checked")) {
        var group;
        if(this.name == "layer5") {
            group = "input:checkbox[name='layer4']";
        } else {
            group = "input:checkbox[name='layer5']";
        }
        $(group).prop("checked", false);
        $(this).prop("checked", true);
    } else {
        $(this).prop("checked", false);
    }
});