var width = 960,
    height = 600,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1.5);

/* create graph */
var svg = d3.select(".container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble")
    .style("position", "absolute")
    .style("top", "5%")
    .style("left", "25%")
    .attr("id", "product");

/* load data */
d3.json("./public/product.json", function(error, root) {
  
  // create nodes and binding data
  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  // here makes circle and text in svg clickable as an anchor link
  var anchor = node.append("a")
      .attr("xlink:href", function(d){ return d.link; })
      .attr("target", "_blank");      
 
 // draw circle
 anchor.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });         
      
 // append text
 anchor.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });   
// TODO: when mouse over text, the circle should also have opacity effect
 
      
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
// https://github.com/mbostock/d3/wiki/Pack-Layout#nodes
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size, r:node.size, link: node.link});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
