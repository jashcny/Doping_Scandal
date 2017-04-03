function dopingByYS(data){

var fullwidth = 980, fullheight = 390;

var margin = {top: 10, right: 170, bottom: 50, left: 40},
    width = fullwidth - margin.left - margin.right,
    height = fullheight - margin.top - margin.bottom;

var	parseDate = d3.time.format("%Y/%m").parse;

var	parseDate2 = d3.time.format("%b, %Y");

// var xScale = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .3);

var xScale = d3.scale.ordinal()
     .rangeRoundBands([0, width], .3);

var yScale = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
        .range(["rgb(243,134,85)","rgb(186,64,24)"])

var dateFormat = d3.time.format("%Y");

// var x = d3.time.scale().range([0, width]);
 var x = d3.scale.ordinal()
    //  .domain(["2004","2015"])
     .rangeRoundBands([0, width*1.7]);

 // var xScaleDate = d3.time.scale()
 //     .domain(d3.extent(data, function(d) { return d.infractiondate; }))
 //     .range([0, width], .3);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .innerTickSize([0])
    .ticks(9)
    .tickFormat(function(d) {
     return dateFormat(d);
 });

var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(6)
    .orient("left"); // for the stacked totals version
    //.tickFormat(d3.format("%")); // for the normalized version

  function make_y_axis() {
	    return d3.svg.axis()
	        .scale(yScale)
	        .orient("left")
	        .ticks(6)
	}
// we don't need to specify the x and y if we provide them as d.x and d.y.
var stack = d3.layout
    .stack();
    //.offset("expand");  // use this to get it to be relative/normalized! Default is zero.

var tooltip3 = d3.select("body").append("div").classed("mytooltip3", true);

var svg = d3.select("#dopingByYear_Sex").append("svg")
    .attr("width", fullwidth)
    .attr("height", fullheight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data.forEach(function(d) {
        d.infractiondate = parseDate(d.infractiondate);

    });

  var genders = ["female","male"];

  color.domain(genders);

x.domain(d3.extent(data, function(d) { return d.infractiondate; }));
 // grouping by gender, right way - and making the x and y the stack looks for.
  var dataToStack = genders.map(function(gender) {
    return data.map(function(d) {
      return {x: d.infractiondate, y: +d[gender], gender: gender};
    })
  });

/*  // grouping by country - wrong way!
var dataToStack = data.map(function(d) { return genders.map(function(gender) { return {x: d.infractiondate, y: +d[gender]}; }); })
*/

  var stacked = stack(dataToStack);
  console.log(stacked);

  // do these after the stack, so you have access to d.y0!
  xScale.domain(data.map(function(d) { return d.infractiondate; }));

  // this domain is using the last of the stacked arrays, and getting the max height.
  yScale.domain([0, d3.max(stacked[stacked.length -1], function(d) { return d.y0 + d.y; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(-250," + height + ")")
      .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end"); // rotate the labels a bit

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
      // we set the colors per gender - the outer nesting
  var gender = svg.selectAll("g.gender")
      .data(stacked) // an array of arrays
    .enter().append("g")
      .attr("class", "gender")
      .style("fill", function(d, i) { return color(d[0].gender); });

  // but we draw one rect for each country, bottom up.
  gender.selectAll("rect")
      .data(function(d) {
        console.log("array for a rectangle", d);
        return d; })  // this just gets the array for bar segment.
    .enter().append("rect")
      .attr("width", xScale.rangeBand())
      .attr("x", function(d) {
        return xScale(d.x); })
      .attr("y", function(d) {
        return yScale(d.y0 + d.y); }) //
      .attr("height", function(d) {
        return yScale(d.y0) - yScale(d.y0 + d.y); }) // height is base - tallness
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout);

  // Building a legend by hand, based on http://bl.ocks.org/mbostock/3886208

  // NOTE: We are reversing because the bars are build bottom up - and we want the legend
  // colors to match the order in the bars. Use slice to make a copy instead of reversing the
  // original in place.

  var genders_reversed = genders.slice().reverse();

  var legend = svg.selectAll(".legend")
      .data(genders_reversed)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 25 + ")"; });

  legend.append("rect")
      .attr("x", width)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) {return color(d);}); // gender name

  legend.append("text")
      .attr("x", width + 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d, i) { return genders_reversed[i].replace(/_/g, " "); });

function mouseover(d) {

  d3.select(this)
    .transition()
    .style("stroke", "black");

//   tooltip3
//     .style("display", null) // this removes the display none setting from it
//     .html("<p>"+parseDate2(d.x )+"<br/>"+d.y+d.gender.replace(/_/g, " ") +
//           "Number of violation: " + d.y +"</p>");
// }

tooltip3
  .style("display", null) // this removes the display none setting from it
  .html("<p>"+parseDate2(d.x )+"<br/>"+d.y+" "+d.gender.replace(/_/g, " ") +
        " " + "tested positive"+"</p>");
}





function mousemove(d) {
  tooltip3
    .style("top", (d3.event.pageY - 10) + "px" )
    .style("left", (d3.event.pageX + 10) + "px");
  }

function mouseout(d) {
  d3.select(this)
    .transition()
    .style("stroke", "none");

  tooltip3.style("display", "none");  // this sets it to invisible!
}

}
