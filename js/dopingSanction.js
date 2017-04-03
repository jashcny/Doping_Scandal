function sanctionByCountry(data){

          var stack = d3.layout.stack();

          var currentMode = "grouped";

          var fullwidth = 1300,
              fullheight = 500;

          var margin = {top: 70, right: 10, bottom: 50, left: 24},
              width = fullwidth - margin.left - margin.right,
              height = fullheight - margin.top - margin.bottom;

          var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .25);

          var y = d3.scale.linear()
                    .range([height, 0]);

          var color = d3.scale.linear()
                  .range(["#FEEDCF","#FDC273","#FB7841","#DC3221","#A40000"])
                  // .range(["#FFF5E7","#FDD59F","#FDBD87","#FB9163","#EF6D56","#D74137","#9D2024"]);

          var tooltip4 = d3.select("body")
                           .append("div")
                           .attr("class", "mytooltip4");

          var xAxis = d3.svg.axis()
                        .scale(x)
                        .tickSize(0)
                        .tickPadding(6)
                        .orient("bottom");

          var yAxis = d3.svg.axis()
                        .scale(y)
                        .ticks(6)
                        .outerTickSize([0])
                        .innerTickSize([0])
                        .orient("left");

          var svg = d3.select("#dopingSanction")
                      .append("svg")
                      .attr("viewBox", "0 0 " + fullwidth + " " + fullheight)
                      .attr("preserveAspectRatio", "xMinYMin slice")
                      .append("g")
                      .attr("transform", "translate(" + margin.left+ "," + margin.top + ")");



          var layerCount; // "layers"

          var ineligibleYears = d3.keys(data[0]).filter(function(key) { return key !== "country"; });

          layerCount = ineligibleYears.length;

          color.domain(d3.range(ineligibleYears.length));

          var dataToStack = ineligibleYears.map(function(period) {
              return data.map(function(d) {
                return {x: d.country, y: +d[period], period: period};
              })
            });

          var layers = stack(dataToStack);

          var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });

          var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

          x.domain(data.map(function(d) {return d.country;}));
          y.domain([0, yGroupMax]);

          var layer = svg.selectAll(".layer")
                         .data(layers)
                         .enter().append("g")
                         .attr("class", "layer")
                         .style("fill", function(d, i) { return color(i); });

          var rect = layer.selectAll("rect")
                          .data(function(d) { return d; })
                          .enter().append("rect")
                          .attr("x", function(d) { return x(d.x); })
                          .attr("y", height)
                          .attr("width", x.rangeBand())
                          .attr("height", 0)
                          .on("mouseover", mouseover)
                          .on("mousemove", mousemove)
                          .on("mouseout", mouseout);


          rect.transition()
              .delay(function(d, i) { return i * 100; })
              .attr("y", function(d) { return y(d.y0 + d.y); })
              .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
              .selectAll("text")
              .attr("dy", "1em")
              .attr("dx", "1.5em")
              .style("font-size","1.5em")
              .style("text-anchor", "end");

          svg.append("g")
              .attr("class", "y axisB")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".5em")
              .style("text-anchor", "end");


          function make_y_axis() {
        	    return d3.svg.axis()
        	        .scale(y)
        	        .orient("left")
        	        .ticks(6)
        	       }

          svg.append("g")
             .attr("class", "grid2")
             .call(make_y_axis()
             .tickSize(-width-10, 0, 0)
             .tickFormat("")
            );


          d3.select("#button-wrap").selectAll("div").on("click", function() {

                var id;
                id = d3.select(this).attr("id");

                d3.select("#button-wrap").selectAll("div").classed("active", false);
                d3.select("#" + id).classed("active", true);

                var timeout = setTimeout(function() {
                d3.select("#" + id).classed("active", true).each(click);
                  }, 500);

                function click() {
                  clearTimeout(timeout);
                  if (id === "grouped") {
                    currentMode = "grouped";
                    transitionGrouped();
                  }
                  else if (id === "stacked") {
                    currentMode = "stacked";
                    transitionStacked();
                  }
                }

            });




            transitionGrouped();

            drawLegend(ineligibleYears);


            function transitionGrouped() {
                y.domain([0, yGroupMax]);

                rect.transition()
                    .duration(1000)
                    .delay(function(d, i) { return i * 100; })
                    .attr("x", function(d, i, j) {  // j is index of parent data item - so, the layer #.
                      return x(d.x) + x.rangeBand() / layerCount * j; })
                    .attr("width", x.rangeBand() / layerCount)
                    .transition()
                    .attr("y", function(d) { return y(d.y); })
                    .attr("height", function(d) { return height - y(d.y); });

             svg.selectAll(".y.axis").transition().duration(3000).call(yAxis);

              }

             function transitionStacked() {

                        y.domain([0, yStackMax]);

                        rect.transition()
                            .duration(1000)
                            .delay(function(d, i) { return i * 100; })
                            .attr("y", function(d) { return y(d.y0 + d.y); })
                            .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
                            .transition()
                            .attr("x", function(d) { return x(d.x); })
                            .attr("width", x.rangeBand());

                        svg.selectAll(".y.axis").transition().duration(2000).call(yAxis);

                    }


            // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208
              function drawLegend(periods) {

                        var adjustX = 1230;

                        var legend = svg.selectAll(".legend")
                                        .data(periods)
                                        .enter().append("g")
                                        .attr("class", "legend")
                                        .attr("transform", function(d,i) {
                                        xOff = (i % 5) * 210
                                        yOff = Math.floor(i  / 5)
                                        return "translate(" + xOff + "," + yOff + ")"});

                        legend.append("rect")
                              .attr("x", width-adjustX-59)
                              .attr("y", -65)
                              .attr("width", 24)
                              .attr("height", 24)
                              .style("fill", function(d, i) {return color(i)});

                        legend.append("text")
                              .attr("x", width-adjustX-29)
                              .attr("y", -47)
                              .style("text-anchor", "start")
                              .style("font-size","1.5em")
                              .text(function(d, i) { return periods[i]});

                  }


              d3.select(window).on('resize', resize);

              function resize() {

              }




              function mouseover(d) {

                       d3.select(this)
                         .transition()
                         .style("stroke", "black");

                       tooltip4
                         .style("display", null)
                         .html("<p><strong>" + d.x+"</strong>"+
                               "<br/>Sanction: " + d.period+
                               "<br/>Numbers of athletes: "+ d.y+ "</p>");
                    }


              function mousemove(d) {

                       tooltip4
                         .style("top", (d3.event.pageY - 10) + "px" )
                         .style("left", (d3.event.pageX + 10) + "px");
                    }

              function mouseout(d) {

                       d3.select(this)
                         .transition()
                         .style("stroke", "none");

                       tooltip4.style("display", "none");

                     }


            }
