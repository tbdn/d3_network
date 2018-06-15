var packets = "../data/fullPackets.json";

let minTime = null;
let maxTime = null;
let showLocals = false;
let showNodeNames = false;
let timeRange;
const LAYERS = [2, 4, 7];
let checkboxes = [];

const width = document.getElementById("networkpanel").clientWidth;
const height = document.getElementById("networkpanel").clientHeight;
const svg = d3.select("#networkpanel")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

/**
 * Function to update all links
 */
let updateAllLinks = function () {
    d3.select("#networkpanel").selectAll("line")
        .each(function (d) {
            svg.selectAll(".link").style("visibility", function (o) {
                return checkVisiblility($(this), o, d, null, null);
            });
        });
};

/**
 * Uncheck all Checkboxes from different categories (layers)
 * 
 * @param {integer} layer 
 * @param {boolean} checked 
 */
let setCategory = function (layer, checked) {
    checkboxes.forEach(function (data, elem) {
        if (layer != elem) {
            $(".filterContainerLayer" + elem + " input").each(function (index, input) {
                $(input).prop("checked", checked);  // Setzen des Hakens der Checkbox
                $(input).attr("checked", checked);    // Setzen des DOM-Attributes der Checkbox
            });
        }
    });
    updateAllLinks();
};

/**
 * Check the Visibility of edges
 * - Triggered through Checkbox select and slider update
 */
let checkVisiblility = function (that, linkObject, layerName, sliderMin, sliderMax) {
    let newVIS = "hidden";
    if (sliderMin == null) {
        sliderMin = $("#timeSlider").slider("values", 0);
    }
    if (sliderMax == null) {
        sliderMax = $("#timeSlider").slider("values", 1);
    }
    let minPercentage = sliderMin / 100;
    let maxPercentage = sliderMax / 100;
    linkObject.packets.some(function (packet) {
        let minTimeBoxed = minTime + minPercentage * timeRange;
        let maxTimeBoxed = minTime + maxPercentage * timeRange;
        packet.layers.forEach(function (layer) {
            let checkbox = $("#chk_" + layer)[0];
            if (checkbox && checkbox.checked && packet.timestamp >= minTimeBoxed && packet.timestamp <= maxTimeBoxed) {
                newVIS = "visible";
                return true;
            } else {
                return false;
            }
        });
    });
    return newVIS;
};
/**
 * Button to display the local nodes (by IP) with different color
 */
$("#btn_showLocalNodes").click(function (e) {
    e.preventDefault();
    showLocals = !showLocals;
    d3.select("#networkpanel").selectAll(".node").each(function (n) {
        if (n.local && showLocals) {
            d3.select(this).select("circle").attr("style", "fill: lime");
        } else {
            d3.select(this).select("circle").attr("style", "");
        }
    });
});

/**
 * Button to toggle node names
 */
$("#btn_toggleNodeNames").click(function (e) {
    e.preventDefault();
    showNodeNames = !showNodeNames;
    var node = d3.select("#networkpanel").selectAll(".node");
    node.selectAll(".nodetext").text(function (d) { return showNodeNames?d.ip:"";});

});


d3.json(packets, function (data) {

    /**
     * Function to create the checkboxes
     * @param {integer} layerNumber 
     * @param {array[string]} data 
     */
    var createCheckboxForLayer = function (layerNumber, data) {
        d3.select(".filterContainerLayer" + layerNumber).selectAll("div")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "checkbox-container")
            .append("div")
            .attr("class", "layer" + layerNumber)
            .each(function (d) {
                // create checkbox for each data
                d3.select(this).append("input")
                    .attr("type", "checkbox")
                    .attr("id", function (layerName) {
                        return "chk_" + layerName;
                    })
                    .on("click", function (layerName, i) {
                        let checkbox = $("#chk_" + layerName).filter("[type='checkbox']");
                        if (checkbox[0].checked) {
                            checkbox.attr("checked", true);
                            setCategory(layerNumber, false);
                        } else {
                            checkbox.attr("checked", false);
                        }
                        updateAllLinks();
                        link.style("visibility", function (linkObject) {
                            return checkVisiblility($(this), linkObject, layerName, null, null);
                        });
                    });
                d3.select(this).append("span")
                    .text(function (layerName) {
                        return layerName;
                    });
            });
    };

    /**
     * Create the force directed graph layout
     */
    var force = d3.layout.force()
        .charge(-600)
        .linkDistance(40)
        .size([width, height])
        .nodes(data.nodes)
        .links(data.links)
        .start();

    /**
     * Draw the graph edges
     */
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", function (d) {
            var classes = "link";
            d.packets.forEach(function (packet) {
                packet.layers.forEach(function (elem) {
                    if (!classes.includes(elem)) {
                        classes = classes + " " + elem;
                    }
                });
                packet.timestamp = parseFloat(packet.timestamp);
                if (minTime == null || packet.timestamp < minTime) {
                    minTime = packet.timestamp;
                }
                if (maxTime == null || packet.timestamp > maxTime) {
                    maxTime = packet.timestamp;
                }
            });
            timeRange = maxTime - minTime;
            return classes;
        })
        .attr("visibility", "hidden");

    /**
     * Draw the graph nodes
     */
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

    /**
     * Set the edge titles (hover)
     */
    link.append("title")
        .text(function (d) {
            return "source: " + d.source.ip + "\n" + "target: " + d.target.ip;
        });

    /**
     * Set the node titles (hover)
     */
    node.append("title")
        .text(function (d) {
            return "ip: " + d.ip;
        });

    /**
     * Define the node shape
     */
    node.append("circle")
        .attr("class", "nodeshape")
        .attr("r", 5);

    /**
     * Set node text
     */
    node.append("text")
        .attr("class", "nodetext")
        .text(function (d) { return "" });
    /**
     * Define the animation (force directed)
     * pull / push nodes
     */
    force.on("tick", function () {
        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node.attr("transform", function (d) {
            return "translate(" + d.x + ", " + d.y + ")";
        });
    });

    /**
     * Bind the drag interaction to the nodes
     */
    node.call(force.drag);

    /**
     * Create the slider
     * Initial code from http://jqueryui.com/slider/#range
     */
    $("#timeSlider").slider({
        range: true,
        min: 0,
        max: 100,
        values: [0, 100],
        /**
         * Define the slide event
         */
        slide: function (event, ui) {
            $("#slider_range").val(ui.values[0] + " - " + ui.values[1]);
            d3.select("#networkpanel").selectAll("line")
                .each(function (d) {
                    link.style("visibility", function (o) {
                        return checkVisiblility($(this), o, d, ui.values[0], ui.values[1]);
                    });
                });
        }
    });
    data.links.forEach(function (link) {
        link.packets.forEach(function (packet) {
            packet.layers.forEach(function(layer, index){
                if(checkboxes[index+1] === undefined){
                    checkboxes[index+1] = new Set();
                }
                checkboxes[index+1].add(layer);
            });
        });
    });
    checkboxes.forEach(function (elem, index){
        createCheckboxForLayer(index, Array.from(elem));
    });
});
