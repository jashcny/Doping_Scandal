function lineChart(dopingYear){
  var fullwidth = 420;
  var fullheight = 200;

  var margin = { top: 5, right: 15, bottom: 20, left: 45};

  var width = fullwidth - margin.left - margin.right;
  var height = fullheight - margin.top - margin.bottom;


  var dateFormat = d3.time.format("%Y");

  var xScale = d3.time.scale()
            .range([ 0, width]);

  var yScale = d3.scale.linear()
            .range([0, height]);


  var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom")
          .tickFormat(function(d) {
            return dateFormat(d);
          })
          .outerTickSize([0]);


  var yAxis = d3.svg.axis()
          .scale(yScale)
          .ticks(6)
          .orient("left")
          .outerTickSize([0])
          .innerTickSize([0]);


	function make_y_axis() {
	    return d3.svg.axis()
	        .scale(yScale)
	        .orient("left")
	        .ticks(6)
	}

  var line = d3.svg.line()
    .x(function(d) {
      return xScale(dateFormat.parse(d.year));
    })
    .y(function(d) {
      return yScale(+d.record);
    });

  var svg = d3.select("#dopingByYear")
        .append("svg")
        .attr("viewBox", "0 0 " + fullwidth + " " + fullheight)
        .attr("preserveAspectRatio", "xMinYMin slice")
        .append("g")
        .attr("transform", "translate(" + margin.left/2 + "," + margin.top + ")");


	var tooltip3 = d3.select("body")
                   .append("div")
                   .attr("class", "mytooltip3");
    // get the min and max of the years in the data, after parsing as dates!
    xScale.domain(d3.extent(dopingYear, function(d){
        return dateFormat.parse(d.year);
        })
    );

    // the domain is from the max of the record to 0 - remember it's reversed.
    yScale.domain([ d3.max(dopingYear, function(d) {
        return +d.record;
      }),
      0
    ]);

    console.log("my data", dopingYear);

      var lineSvg = svg.append("g")
          .datum(dopingYear);



      lineSvg.append("path")
      .attr("class", "line")
      .attr("d", line)  // line is a function that will operate on the data array, with x and y.
      .attr("fill", "none")
      .attr("stroke", "#FB7841")
      .attr("stroke-width", 1.5);

      lineSvg
      .on("mouseover",HoverIn)
      .on("mouseout",HoverOut);


      var yt=svg.append("g")
      .attr("class", "yAxis")
      .attr("font-size","6px")
      .call(yAxis)

      yt.selectAll("text")
        .attr("x", -10);

    svg.append("g")
      .attr("class", "x axis2")
      .attr("font-size","6px")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
       .attr("class", "grid1")
       .call(make_y_axis()
       .tickSize(-width-10, 0, 0)
       .tickFormat("")
        )



    var SMcircles = lineSvg.selectAll("dots")
					    .data(dopingYear)
              .enter()
							.append("circle")
              .attr("class", "dots");

    SMcircles.attr("cx", function(d) {
				return xScale(dateFormat.parse(d.year));
			})
			.attr("cy", function(d) {
				return yScale(d.record);
			})
			.attr("r", 1)
      .style("fill","#A40000")
			.style("opacity", 0.9);


    SMcircles
      .on("mouseover", mouseoverFunc)
      .on("mousemove", mousemoveFunc)
      .on("mouseout",	mouseoutFunc);

      function mouseoverFunc(d) {

        d3.select(this)
          .transition()
          .duration(500)
          .style("opacity", 1)
          .attr("r", 4);


        tooltip3
          .style("display", null) // this removes the display none setting from it
          .html("<p>" + d.year +
                "<br><strong>Total number of doping violation: </strong>" +"<br>"+ d.record + "</p>");
        }

      function mousemoveFunc(d) {
         tooltip3
          .style("top", (d3.event.pageY - 10) + "px" )
          .style("left", (d3.event.pageX + 10) + "px");
        }

      function mouseoutFunc(d) {

        d3.select(this)
          .transition()
          .style("opacity", 0.3)
          .attr("r", 1);

        tooltip3.style("display", "none");
      }  // this sets it to invisible!

    d3.select(window).on('resize', resize);

       function resize() {

       }


       function HoverIn(d){
            d3.select(this).select("path")
                .attr("id", "focused");
            }

        function HoverOut(d) {
       d3.select(this).select("path")
            .attr("id", null);
       }

}
