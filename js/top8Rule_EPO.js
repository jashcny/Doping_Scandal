function top8Rule_EPO(data){

  var fullwidth = 920,
      fullheight = 90;

  var margin = {top: 40, right:1, bottom: 10, left: 235},
      width = fullwidth - margin.right - margin.left,
      height = fullheight - margin.top - margin.bottom;

  var xScale = d3.scale.linear()
      .range([0, width/1.1]);

  var yScale = d3.scale.ordinal()
      .rangeRoundBands([0, height*9.2], .009);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("top")
      .ticks(5)
      .outerTickSize([2]);

  var tooltip2 = d3.select("body")
      .append("div")
      .attr("class","mytooltip2")

  var epoObj = data.filter(function(d){
                          return d.rule == "EPO"
                      });

  // console.log(epoObj);

  var svg = d3.select("#top8Rule_EPO").append("svg")
          .attr("class", "barsvg")
          .attr("viewBox", "0 0 " + fullwidth + " " + fullheight)
          .attr("preserveAspectRatio", "xMinYMin slice")
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
         .attr("class", "x axis");


      xScale.domain([ 0, d3.max(data, function(d) {
      			return +d.count ;
      		})]);

      yScale.domain(data.map(function(d) { return d.rule; }));


  var bar = svg.selectAll(".bar")
      .data(epoObj);

  var barCreate = bar.enter().append("g")
      .attr("class", "bar")
      .style("fill-opacity", 2);

      barCreate.append("rect")
               .attr("width", function(d) {
      					return xScale(+d.count);
      				})
               .attr("height", yScale.rangeBand()/1.7);

      barCreate.append("text")
          .attr("class", "label1")
          .attr("x", -5)
          .attr("y", yScale.rangeBand()/2.3)
          .attr("dy", "0.08em")
          .attr("text-anchor", "end")
          .attr("font-size","15px")
          .text(function(d) { return d.rule; });


  var bars = d3.selectAll("g.bar")
               .on("mousemove", mousemove)
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
         .attr("class", "grid1")
         .call(make_x_axis()
         .tickSize(-height/1.1,0,0)
         .tickFormat(""))

      svg.transition().select(".x.axis")
         .duration(1000)
         .attr("font-size","15px")
         .call(xAxis);



      function mousemove(d) {

               tooltip2
                  .style("top", (d3.event.pageY - 10) + "px" )
                  .style("left", (d3.event.pageX + 10) + "px");

               }

      function mouseout(d) {

               d3.select(this)
              .transition()

              tooltip2.style("display", "none");

              }

      function mouseover(d) {

              tooltip2
                 .style("display", null) // this removes the display none setting from it
                 .html("<p>Anti-doping Violation Rule: "+ d.rule+"</br>"+ "Number: " +d.count +"</p>");

             }
             }
