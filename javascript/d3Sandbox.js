var testfile = "../data/testfile.json";

const width = document.getElementById("networkpanel").clientWidth;
const height = document.getElementById("networkpanel").clientHeight;
const svg = d3.select("#networkpanel")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json(testfile, function(data){
    // Filter version 2.0
    d3.select(".filterContainer").selectAll("div")
        .data(["icmp", "tcp", "udp"])
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
                    // register on click event
                    console.log(this);
                    var lVisibility = this.checked ? "visible" : "hidden";
                    link.style("visibility", function (o) {
                        var lOriginalVisibility = $(this).css("visibility");
                        return o.layers[0] === d ? lVisibility : lOriginalVisibility;
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
            return "link " + d.layers;
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
        .text(function(d) { return d.name; });

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
});
