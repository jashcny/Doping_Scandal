function top8Rule_ABP_EPO(data){

            var fullwidth = 920,
                fullheight = 150;

            var margin = {top: 40, right:1, bottom: 10, left: 215},
                width = fullwidth - margin.right - margin.left,
                height = fullheight - margin.top - margin.bottom;

            var xScale = d3.scale.linear()
                           .range([0, width/1.1]);

            var yScale = d3.scale.ordinal()
                           .rangeRoundBands([0, height/1.1], .009);

            var xAxis = d3.svg.axis()
                          .scale(xScale)
                          .orient("top")
                          .ticks(5)
                          .outerTickSize([2]);

            var tooltip2 = d3.select("body")
                             .append("div")
                             .attr("class","mytooltip2");

            var anaObj = data.slice(2,4);

            // console.log(anaObj);

            var svg = d3.select("#top8Rule_ABP")
                        .append("svg")
                        .attr("class", "barsvg")
                        .attr("viewBox", "0 0 " + fullwidth + " " + fullheight)
                        .attr("preserveAspectRatio", "xMinYMin slice")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
               .attr("class", "x axis");

            svg.append("g")
               .attr("class", "y axis");


            xScale.domain([ 0, d3.max(data, function(d) {

        					return +d.count ;

        				})]);

            yScale.domain(anaObj.map(function(d) { return d.rule; }));

            var bar = svg.selectAll(".bar")
                         .data(anaObj,function(d) { return d.rule; });

            var barCreate = bar.enter()
                               .append("g")
                               .attr("class", "bar")
                               .attr("transform", function(d) { return "translate(0," + yScale(d.rule) + ")"; })
                               .style("fill-opacity", 2);

            barCreate.append("rect")
                     .attr("width", function(d) {
         						     return xScale(+d.count);
         					     })
                     .attr("height", yScale.rangeBand()/1.7);

            barCreate.append("text")
                     .attr("class", "label1")
                     .attr("x", -5)
                     .attr("y", yScale.rangeBand()/3)
                     .attr("dy", "0.08em")
                     .attr("text-anchor", "end")
                     .attr("font-size","15px")
                     .text(function(d) { return d.rule; });


            var bars = d3.selectAll("g.bar");

            bars.on("mousemove", mousemove)
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);


            d3.select(window).on('resize', resize);

            function resize() {

                      }

            function make_x_axis() {
                return d3.svg.axis()
                         .scale(xScale)
                         .orient("top")
                         .ticks(5)
                       }


            svg.append("g")
  		         .attr("class", "grid2")
               .call(make_x_axis()
	             .tickSize(-height/1.1,0,0)
	             .tickFormat("")
  		          );


            function mouseover(d) {

                      d3.select(this)
                        .transition()
                        .style("stroke", "black");


                      tooltip2
                          .style("display", null) // this removes the display none setting from it
                          .html("<p><strong>Anti-doping Violation Rule: </strong>"+ d.rule+"</br>"+ "<strong>Number: </strong>" +d.count +"</p>");

                            }

            function mousemove(d) {

                      tooltip2
                          .style("top", (d3.event.pageY - 10) + "px" )
                          .style("left", (d3.event.pageX + 10) + "px");
                      }

            function mouseout(d) {

                      d3.select(this)
                        .transition()
                        .style("stroke", "none");

                      tooltip2.style("display", "none");

                        }



          }
