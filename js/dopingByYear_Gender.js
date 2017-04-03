function  dopingByY_G(data){

          var fullwidth = 900, fullheight = 440;

          var margin = {top: 70, right: 10, bottom: 40, left: 34.5},
              width = fullwidth - margin.left - margin.right,
              height = fullheight - margin.top - margin.bottom;

          var dateFormat = d3.time.format("%Y");

          var xScale = d3.scale.ordinal()
               .rangeRoundBands([0, width], .3);

          var yScale = d3.scale.linear()
              .rangeRound([height, 0]);

          var color = d3.scale.ordinal()
              .range(["rgb(243,134,85)","rgb(186,64,24)"])

          var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .innerTickSize([0])
              .tickFormat(function(d) {
               return dateFormat(d);
              });

          var yAxis = d3.svg.axis()
              .scale(yScale)
              .ticks(6)
              .orient("left");

          function make_y_axis() {
                    return d3.svg.axis()
                             .scale(yScale)
                             .orient("left")
                             .ticks(6)
                   }

          var stack = d3.layout
              .stack();

          var tooltip3 = d3.select("#tooltip3")
                           .attr("class", "mytooltip3")
                           .style("opacity", 0);

          var svg = d3.select("#dopingByYear_Sex").append("svg")
                      .attr("viewBox", "0 0 " + fullwidth + " " + fullheight)
                      .attr("preserveAspectRatio", "xMinYMin slice")
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          data.forEach(function(d) {
               d.infractiondate = dateFormat.parse(d.infractiondate);
              });

          var genders = ["Female","Male"];

          color.domain(genders);

          var dataToStack = genders.map(function(gender) {
                              return data.map(function(d) {
                              return {x: d.infractiondate, y: +d[gender], gender: gender};
                              })
                            });

          var stacked = stack(dataToStack);
              console.log(stacked);


          xScale.domain(data.map(function(d) { return d.infractiondate; }));

          yScale.domain([0, d3.max(stacked[stacked.length -1], function(d) { return d.y0 + d.y; })]);


          svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(15," + height + ")")
             .call(xAxis)
             .selectAll("text")
             .attr("dy", "1.5em")
             .style("text-anchor", "end");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text");

          svg.append("g")
             .attr("class", "grid1")
             .call(make_y_axis()
             .tickSize(-width-10, 0, 0)
             .tickFormat("")
              )

          var gender = svg.selectAll("g.gender")
                          .data(stacked)
                          .enter().append("g")
                          .attr("class", "gender")
                          .style("fill", function(d, i) { return color(d[0].gender); });


          gender.selectAll("rect")
                .data(function(d) {
                  // console.log("array for a rectangle", d);
                 return d; })
                .enter().append("rect")
                .attr("width", xScale.rangeBand())
                .attr("x", function(d) {
                      return xScale(d.x); })
                .attr("y", function(d) {
                      return yScale(d.y0 + d.y); })
                .attr("height", function(d) {
                      return yScale(d.y0) - yScale(d.y0 + d.y); })
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

          svg.append("text")
              .attr("x", -34)
              .attr("y", -12)
              .style("font-size","1em")
              .style("text-anchor", "front")
              .text("Numbers of athletes tested positive");


           // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208



          var genders_reversed = genders.slice().reverse();

          var legend = svg.selectAll(".legend")
              .data(genders_reversed)
              .enter()
              .append("g")
              .attr("class", "legend")
              .attr("transform", function(d,i) {
              xOff = (i % 3) * 100
              yOff = Math.floor(i  / 3)
              return "translate(" + xOff/1.3 + "," + yOff/1.3 + ")"});


          legend.append("rect")
              .attr("x", -32)
              .attr("y",-67)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d) {return color(d);});

          legend.append("text")
              .attr("x", -10)
              .attr("y",-57)
              .attr("dy", ".35em")
              .style("text-anchor", "start")
              .text(function(d, i) { return genders_reversed[i].replace(/_/g, " "); });


          d3.select(window).on('resize', resize);


          function resize() {

              }

          function mouseover(d) {

                   d3.select(this)
                     .transition()
                     .style("stroke", "black");

                   tooltip3.transition().duration(100)
                           .style("opacity", 1);

                   tooltip3
                      .style("top", (d3.event.pageY - 10) + "px" )
                      .style("left", (d3.event.pageX + 10) + "px");

                   tooltip3.select(".yearG").text(dateFormat(d.x));
                   tooltip3.select(".gender").text(d.gender);
                   tooltip3.select(".yearVal").text(+d.y);
          }



          function mouseout(d) {

                   d3.select(this)
                     .transition()
                     .style("stroke", "none");

                   tooltip3.transition().duration(300)
                           .style("opacity", 0);
          }

          }
