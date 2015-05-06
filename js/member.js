(function(){
  var width = 960,
      height = 600;

  /* constructs a new ordinal scale with a range of twenty categorical colors 
   * https://github.com/mbostock/d3/wiki/Ordinal-Scales
   */
  var color = d3.scale.category20();

  /* constructs a new force-directed layout with the default settings
   * https://github.com/mbostock/d3/wiki/Force-Layout
   */
  var force = d3.layout.force()
      .charge(-500)
      .linkDistance(280)
      .size([width, height]);

  /* insert svg element in body */
  var svg = d3.select(".container").append("svg")
      .attr("width", width) 
      .attr("height", height)
      .style("position", "absolute")
      .style("top", "5%")
      .style("left", "25%"); 
  // TODO: text on svg

  /* tooltip when mouse over node */
  var tip = d3.tip()
              .attr("class", "d3-tip")
              .offset([-10, 0])
              .html(function(d){
                //console.log(d); // DEBUG
                return "\
                <img src='" + d.photo + "'><br>\
                <span style='color:green'>" + d.name + "</span><br>\
                <span style='color:white'>" + d.description + "</span>";
              });    
  svg.call(tip);            


  /* read data set (graph is a parsed json) 
   * in miserables.json, we have two arrays nodes[] and links[]
   * so we can access json with graph.nodes, graph.links
   */
  d3.json("./public/miserables.json", function(error, graph) {
    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
        /* force.start(): tarts the simulation
         * this method must be called when the layout is first created
         * after assigning the nodes and links. 
         */

    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
          if(d.group == 0)
            return 50;
          return 40;
        })
        .on("mouseover", function(d){ 
            tip.show(d);
            d3.select(this).style("fill", color(2));
          })
        .on("mouseout", function(d){
            tip.hide(d);            
            d3.select(this).style("fill", color(d.group));
          })
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });      

    /* for force.on("tick") */
    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
  });
})();