function worldMap(world,dopingCount) {

          var width = 880,
              height = 480,
              center = [width / 2, height / 2];

          var projection = d3.geo.mercator()
                          	 .scale(110)
                             .translate([width/2+20, height/2+20]);

          var path = d3.geo.path()
                       .projection(projection);

          var zoom = d3.behavior.zoom()
                       .scaleExtent([1, 8])
                       .on("zoom", move);

          var colorScale = d3.scale.linear()
                             .domain([0,18])
                             .range(["#FEEDCF","#A40000"]).interpolate(d3.interpolateLab);

        	var tooltip = d3.select("#tooltip")
                      		.attr("class", "mytooltip1")
                          .style("opacity", 0);

        	var svg = d3.select("#worldMap")
                      .append("svg")
                      .attr("viewBox", "0 0 " + width + " " + height )
                      .attr("preserveAspectRatio", "xMinYMin slice")
                      .append("g")
                      .call(zoom);

          svg.on("wheel.zoom", null);

          svg.on("mousewheel.zoom", null);

          svg.append("rect")
             .attr("class", "overlay")
             .attr("width", width)
             .attr("height", height);



          var g = svg.append("g")
                     .attr("class", "countries")
                     .selectAll("path")
                     .data(topojson.feature(world, world.objects.units).features)
                     .enter()
                     .append('path')
                     .attr('d', function(d){
                          return path(d)
                        })
                     .attr('fill', function(d,i) {
                          return getColor(d);
                        })
                     .attr("id", function(d){
                          if(d.id != "ATA")
                            return d.id;
                        })
                     .on("mouseover", mouseover)
                     .on("mouseout",mouseout );


           function getColor(d) {
                     var dataRow =countryById.get(d.id);
                     if ((dataRow)&&(dataRow.total<18)) {
                         console.log(dataRow);
                        return colorScale(dataRow.total);
                        } else if ((dataRow)&&(dataRow.total>18)){
                            return "rgb(88,0,37)";
                        }else {
                         console.log("no dataRow", d);
                         return "rgb(212,213,214)";
                        }
                      }


            var legendLinear = d3.legend.color()
                                 .shapeWidth(18)
                                 .shapeHeight(18)
                                 .orient("vertical")
                                 .cells([0,6,12,18])
                                 .labels(["0","6","12","18"])
                                 .scale(colorScale);

             svg.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .attr("x", 20)
                .attr("y", 410)
                .style("fill","rgb(88,0,37)");

             svg.append("text")
                .attr("x",46)
                .attr("y",424)
                .style("text-anchor", "left")
                .style("font-size",".9em")
                .text("More than 18");

             svg.append("g")
                .attr("class", "legendLinear")
                .attr("transform", "translate(20," + (height-150) +")");

             svg.select(".legendLinear")
                .call(legendLinear);


             make_buttons();

             function make_buttons() {

                     svg.selectAll(".scalebutton")
                        .data(['zoom_in', 'zoom_out'])
                        .enter()
                        .append("g")
                        .attr("id", function(d){return d;})
                        .attr("class", "scalebutton")
                        .attr({x: 20, width: 20, height: 20})
                        .append("rect")
                        .attr("y", function(d,i) { return 20 + 25*i })
                        .attr({x: 20, width: 20, height: 20});


                    svg.select("#zoom_in")
                      .append("line")
                        .attr({x1: 25, y1: 30, x2: 35, y2: 30 })
                        .attr("stroke", "#fff")
                        .attr("stroke-width", "2px");

                    svg.select("#zoom_in")
                      .append("line")
                        .attr({x1: 30, y1: 25, x2: 30, y2: 35 })
                        .attr("stroke", "#fff")
                        .attr("stroke-width", "2px");

                    // Minus button
                    svg.select("#zoom_out")
                      .append("line")
                        .attr({x1: 25, y1: 55, x2: 35, y2: 55 })
                        .attr("stroke", "#fff")
                        .attr("stroke-width", "2px");


                    svg.selectAll(".scalebutton")
                      .on("click", function() {
                        d3.event.preventDefault();

                    var scale = zoom.scale(),
                        extent = zoom.scaleExtent(),
                        translate = zoom.translate(),
                        x = translate[0], y = translate[1],
                        factor = (this.id === 'zoom_in') ? 2 : 1/2,
                        target_scale = scale * factor;

                    var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
                    if (clamped_target_scale != target_scale){
                        target_scale = clamped_target_scale;
                        factor = target_scale / scale;
                      }

                        // Center each vector, stretch, then put back
                        x = (x - center[0]) * factor + center[0];
                        y = (y - center[1]) * factor + center[1];

                      // Transition to the new view over 350ms
                    d3.transition().duration(350).tween("zoom", function () {

                          var interpolate_scale = d3.interpolate(scale, target_scale),
                              interpolate_trans = d3.interpolate(translate, [x,y]);

                          return function (t) {
                              zoom.scale(interpolate_scale(t))
                                  .translate(interpolate_trans(t));

                              svg.call(zoom.event);
                            };
                          });
                        });
                      }


                    function zoomIn() {
                        zoom.scale(zoom.scale()*2);
                        move();
                    }

                    d3.select(window).on('resize', resize);

                    function resize() {
                    }


                    function move() {

                      var t = d3.event.translate,
                          s = d3.event.scale;
                          t[0] = Math.min(width * (s - 1), Math.max(width * (1 - s), t[0]));
                          t[1] = Math.min(height * (s - 1), Math.max(height * (1 - s), t[1]));

                          zoom.translate(t);
                          g.style("stroke-width", 1 / s)
                           .attr("transform", "translate(" + t + ")scale(" + s + ")");
                        }

                    function mouseover(d){

                             d3.select(this).moveToFront();

                             var thisId = d3.select(this).attr("id");
                             highlight(thisId);

                             tooltip.transition()
                                    .duration(100)
                                    .style("opacity", 1);

                             tooltip
                                .style("top", (d3.event.pageY - 10) + "px" )
                                .style("left", (d3.event.pageX + 10) + "px");


                              if (countryById.get(d.id) && countryById.get(d.id)["total"]) {
                               tooltip.select(".area").text(countryById.get(d.id)['country']);
                               tooltip.select(".val").text(countryById.get(d.id)["total"]);
                               tooltip.select(".femaleVal").text(countryById.get(d.id)["female"]);
                               tooltip.select(".maleVal").text(countryById.get(d.id)["male"]);
                              } else {
                              tooltip.select(".area").text("No data for " + d.properties.name);
                              tooltip.select(".val").text("NA");
                              tooltip.select(".femaleVal").text("NA");
                              tooltip.select(".maleVal").text("NA");
                              }
                          }


                     function mouseout(d) {

                              d3.select(this).classed("selected", false);

                              disHighlight(d3.select(this).attr("id"));

                              tooltip.transition()
                                     .duration(300)
                                     .style("opacity", 0);
                            }


              }
