function draw(jsonString){
	var margin = {top: 20, right: 20, bottom: 20, left: 65},
	    width = 960 - margin.right - margin.left,
	    height = 800 - margin.top - margin.bottom;
	    
	var i = 0,
	    duration = 750,
	    root;

	var tree = d3.layout.tree()
	    .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	d3.selectAll("#draw > *").remove();

	var svg = d3.select("#draw").append("svg")
	    .attr("width", width + margin.right + margin.left)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// d3.json(jsonString, function(error, test) {
	  root = JSON.parse(jsonString);
	  root.x0 = height / 2;
	  root.y0 = 0;

	  function collapse(d) {
	    if (d.children) {
	      d._children = d.children;
	      d._children.forEach(collapse);
	      d.children = null;
	    }
	  }

	  function Firstcollapse(d){
	  	if(d._children){
	  		d.children = d._children;
	  		d._children = null;
	  		Firstcollapse(d.children[0]);
	  	}
	  	else
	  		return;
	  }

	  root.children.forEach(collapse);

	  if(root.children)
	  	Firstcollapse(root.children[0]);

	  update(root);

	// });

	//d3.select(self.frameElement).style("height", "800px");

	var levelWidth = [1];
	function childCount(level, n) {

	  if(n.children && n.children.length > 0) {
	    if(levelWidth.length <= level + 1) levelWidth.push(0);

	    levelWidth[level+1] += n.children.length;
	    n.children.forEach(function(d) {
	      childCount(level + 1, d);
	    });
	  }
	};

	function update(source) {
	  levelWidth = [1];
	  childCount(0, root); 
	  var newHeight = d3.max(levelWidth) * 20; // 20 pixels per line  
	  tree = tree.size([newHeight + height, width]);
	  d3.select("svg").attr("height", newHeight+height + margin.top + margin.bottom)


	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
	      links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 170; });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .on("click", click);

	  nodeEnter.append("circle")
	      .attr("r", 1e-6)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeEnter.append("text")
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .text(function(d) { return d.name; })
	      .style("fill-opacity", 1e-6);

	  nodeEnter.append("text")
	  	  .attr("class","plus")
	      .attr("dx", function(d) { return -3; })
	      .attr("dy", ".35em")
	      .text("+")
	      .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

	  nodeUpdate.select("text")
	      .style("fill-opacity", 5);

	  nodeUpdate.select("text.plus")
	  	  .style("fill-opacity", function(d) { return d._children ? "5" : "1e-6";});

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .remove();

	  nodeExit.select("circle")
	      .attr("r", 1e-6);

	  nodeExit.selectAll("text")
	      .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
	      .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = {x: source.x0, y: source.y0};
	        return diagonal({source: o, target: o});
	      });

	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}

	function expand(d){   
	    var children = (d.children)?d.children:d._children;
	    if (d._children) {        
	        d.children = d._children;
	        d._children = null;       
	    }
	    if(children)
	      children.forEach(expand);
	}

	function collapse(d) {
	  if (d.children) {
	    d._children = d.children;
	    d._children.forEach(collapse);
	    d.children = null;
	  }
	}

	var expandAllObj = d3.select("#expandAllObj")
	.on('click',function(){
		expand(root); 
    	update(root);
	});

	var collapseAllObj = d3.select("#collapseAllObj")
	.on('click',function(){
    	root.children.forEach(collapse);
    	update(root);
	});
}
