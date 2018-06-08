var testfile = "../data/testfile.json";
var packets = "../data/packets.json";

let minTime = null;
let maxTime = null;
let showLocals = false;
let timeRange;

//DEBUG
let count = 0;

const width = document.getElementById("networkpanel").clientWidth;
const height = document.getElementById("networkpanel").clientHeight;
const svg = d3.select("#networkpanel")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let checkVisiblility = function(that, o, d, type) {
    let newVIS = that.css("visibility");
    let minPercentage = $( "#timeSlider ").slider( "values", 0 )/100;
    let maxPercentage = $( "#timeSlider" ).slider( "values", 1 )/100;
    o.packets.some(function(packet){
        let minTimeBoxed = minTime + minPercentage*timeRange;
        let maxTimeBoxed = minTime + maxPercentage*timeRange;

        if(type === "checkbox") {
            if(packet.layers.includes(d)) {
                if($("#chk_"+d)[0].checked && packet.timestamp >= minTimeBoxed && packet.timestamp <= maxTimeBoxed) {
                    newVIS = "visible";
                    return true;
                } else {
                    newVIS = "hidden";
                    return false;
                }
            }
        } else if(type === "slider") {
            if(packet.timestamp >= minTimeBoxed && packet.timestamp <= maxTimeBoxed) {
                return d.packets[0].layers.some(function (layer) {
                    let checkbox = $("#chk_"+layer).filter("[type='checkbox']");
                    if(checkbox.length === 1) {
                        if(checkbox[0].checked) {
                            newVIS = "visible";
                            return true;
                        } else {
                            newVIS = "hidden";
                            return false;
                        }
                    }
                });
            } else {
                newVIS = "hidden";
                return false;
            }
        }
    });
    return newVIS;
};

$("#btn_showLocalNodes").click(function(e){
        e.preventDefault();
        showLocals = !showLocals;
        d3.select("#networkpanel").selectAll(".node").each(function (n) {
            if(n.local && showLocals){
                d3.select(this).select("circle").attr("style","fill: lime");
            }else{
                d3.select(this).select("circle").attr("style","");
            }
        });
    });

d3.json(packets, function(data){
    d3.select(".filterContainerLayer5").selectAll("div")
        .data(["dns", "http", "ftp", "frame"])
        .enter()
        .append("div")
        .attr("class", "checkbox-container")
        .append("label")
        .each(function (d) {
            // create checkbox for each data
            d3.select(this).append("input")
                .attr("type", "checkbox")
                .attr("id", function (d) {
                    return "chk_" + d;
                })
                .attr("checked", true)
                .on("click", function (d, i) {
                    link.style("visibility", function (o) {
                       return checkVisiblility($(this), o, d, "checkbox");
                    });
                });
            d3.select(this).append("span")
                .text(function (d) {
                    return d;
                });
        });

    d3.select(".filterContainerLayer4").selectAll("div")
        .data(["icmp", "tcp", "udp", "smtp", "snpm"])
        .enter()
        .append("div")
        .attr("class", "checkbox-container")
        .append("label")
        .each(function (d) {
            // create checkbox for each data
            d3.select(this).append("input")
                .attr("type", "checkbox")
                .attr("id", function (d) {
                    return "chk_" + d;
                })
                .attr("checked", true)
                .on("click", function (d, i) {
                    link.style("visibility", function (o) {
                        return checkVisiblility($(this), o, d, "checkbox");
                    });
                });
            d3.select(this).append("span")
                .text(function (d) {
                    return d;
                });
        });

    // create the layout
    var force = d3.layout.force()
        .charge(-200)
        .linkDistance(20)
        .size([width, height])
        .nodes(data.nodes)
        .links(data.links)
        .start();

    // draw the graph edges
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", function (d) {
            var classes = "link";
            d.packets.forEach(function(packet) {
                packet.layers.forEach(function(elem){
                    if(!classes.includes(elem)) {
                        classes = classes + " " + elem;
                    }
                });
                packet.timestamp = parseFloat(packet.timestamp);
                if(minTime == null || packet.timestamp < minTime){
                    minTime = packet.timestamp;
                }
                if(maxTime == null || packet.timestamp > maxTime){
                    maxTime = packet.timestamp;
                }
            });
            timeRange = maxTime-minTime;
            return classes;
        });

    // draw the graph nodes
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

    link.append("title")
        .text(function(d) {
            return "source: " + d.source.ip + "\n" + "target: " + d.target.ip;
        });

    node.append("title")
        .text(function (d) {
            return "ip: " + d.ip;
        });

    node.append("circle")
        .attr("class", "nodeshape")
        .attr("r", 5);

    node.append("text")
        .attr("class", "nodetext")
        .text(function(d) { return d.ip; });

    // define what to do one each tick of the animation
    force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });
    });
    // bind the drag interaction to the nodes
    node.call(force.drag);
    // Initial code from http://jqueryui.com/slider/#range
    $("#timeSlider").slider({
            range: true,
            min: 0,
            max: 100,
            values: [ 0, 100 ],
            slide: function(event, ui) {
            $( "#slider_range" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            d3.select("#networkpanel").selectAll("line")
                .each(function (d) {
                     link.style("visibility", function (o) {
                             return checkVisiblility($(this), o, d, "slider");
                         });
                });
            }
        });

});
