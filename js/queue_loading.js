var countryById = d3.map();

queue()
  .defer(d3.json, "data/countries.json")
  .defer(d3.csv, "data/dopingByCountry.csv",typeAndSet)
  .defer(d3.csv, "data/countrySanction.csv")
  .defer(d3.csv, "data/rule.csv")
  // .defer(d3.csv, "data/dopingByYear.csv")
  .defer(d3.csv, "data/dopingByYear_Gender.csv")
  .await(ready);

function ready(error, world, dopingCount,sanction,ruleCount,genderYear) {
  if (error) { console.log(error); }
  dopingByY_G(genderYear);
  worldMap(world,dopingCount);
  sanctionByCountry(sanction);
  top8Rule_Anabolic(ruleCount);
  top8Rule_ABP_EPO(ruleCount);
  // lineChart(dopingYear);

} //end function ready


function typeAndSet(d) {
    d.total = +d.total;
    countryById.set(d["countrycode"], d); // this is a d3.map, being given a key, value pair.
    return d;
}


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function highlight(id){
    d3.selectAll("path#"+id).moveToFront();
    d3.selectAll("#"+id).classed("selected", true);
    console.log(id);
}

function disHighlight(id){
    d3.selectAll("#"+id).classed("selected", false);
}
