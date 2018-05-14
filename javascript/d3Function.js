var filename = "../data/data.json";

d3.json(filename, function(data){

    var incoming = [];
    var outgoing = [];

    for(link of data.links){
        incoming[link.target] = incoming[link.target] == undefined?1:incoming[link.target]+1;
        outgoing[link.source] = outgoing[link.source] == undefined?1:outgoing[link.source]+1;
    }

    var width = 1500,
        height = 1500;

    var svg = d3.select("body")
        .append("center")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

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
        .attr("class", "node")

    node.append("title")
        .text(function(d) { return d.ip+"\n"+"incoming: "+incoming[d.index]+"\n"+"outgoing: "+outgoing[d.index]; });

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
