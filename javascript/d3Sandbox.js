var connectionsAndNodesFile = "../data/conandnode.json";
var complete = "../data/completePackets.json";

d3.json(connectionsAndNodesFile, function(data){

    // Find blank links, which give the error
    // "Uncaught TypeError: Cannot read property 'weight' of undefined"
    /*
    data.nodes.forEach(function(link, index, list) {
        if (typeof data.nodes[link.source] === 'undefined') {
            console.log('undefined source', link);
        }
        if (typeof data.nodes[link.destination] === 'undefined') {
            console.log('undefined destination', link);
        }
    });
    */

    var width = document.getElementById("networkpanel").clientWidth,
        height = document.getElementById("networkpanel").clientHeight;

    var svg = d3.select("#networkpanel")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    console.log(data);

    // create the layout
    var force = d3.layout.force()
        .charge(-300)
        .linkDistance(100)
        .size([width, height])
        .nodes(data.nodes)
        .links(data.links)
        .start();

    // draw the graph edges
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link");

    // draw the graph nodes
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g")
        .attr("class", "node");

    /*
    node.append("title")
        .text(function(d) { return d.ip+"\n"+"incoming: "+incoming[d.index]+"\n"+"outgoing: "+outgoing[d.index]; });
     */

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
