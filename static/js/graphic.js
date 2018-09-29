
// svg container
var height = 600;
var width = 1000;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// chart area minus margins
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

// create svg container
var svg = d3.select('#svg_graphic_section').append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// shift everything over by the margins
var chartGroup = svg;
// svg.append("g")
    // .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.json('/tax_data',function(err,data){
    if (err) throw err;
    // data
    var incomeArray = [];
    var taxRateArray = [];
    // var data = [ { "federal_tax_rate": 1,   "gross_income": 5},  { "federal_tax_rate": 20,  "gross_income": 20},
    //              { "federal_tax_rate": 40,  "gross_income": 10}, { "federal_tax_rate": 60,  "gross_income": 40},
    //              { "federal_tax_rate": 80,  "gross_income": 5},  { "federal_tax_rate": 100, "gross_income": 60}];
    data.forEach(function(tax_point){
        tax_point.federal_tax_rate=+tax_point.federal_tax_rate
        tax_point.gross_income=+tax_point.gross_income

        taxRateArray.push(+tax_point.federal_tax_rate)
        incomeArray.push(+tax_point.gross_income)
    })

    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data,d=>d.federal_tax_rate)])
        .range([chartHeight, 0]);

    // scale x to chart width
    var xScale = d3.scaleBand()
        .domain(d3.extent(data,d=>d.gross_income))
        .range([0, chartWidth])
        .padding(0.1);

    // create axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis);


        // Line generators for each line
    var line1 = d3.line()
        .x(d=>d.gross_income)
        .y(d=>d.federal_tax_rate);

    // var line2 = d3.line()
    // .x(d => xTimeScale(d.date))
    // .y(d => yLinearScale2(d.smurf_sightings));



    // Append a path for line1
   var lineGroup= chartGroup.append("path")
    // .data(data)
    .attr("d", line1(data))
    // .classed("line green", true)
    // .attr("x", (d, i) => xScale(dataCategories[i]))
    // .attr("y", d => yScale(d));
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

    // Append a path for line2
    // chartGroup.append("path")
    // .data([smurfData])
    // .attr("d", line2)
    // .classed("line blue", true);

    // Create the rectangles using data binding
    // var barsGroup = chartGroup.selectAll("rect")
    //     .data(dataArray)
    //     .enter()
    //     .append("rect")
    //     .attr("x", (d, i) => xScale(dataCategories[i]))
    //     .attr("y", d => yScale(d))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", d => chartHeight - yScale(d))
    //     .attr("fill", "green");

    // Create the event listeners with transitions
    lineGroup.on("mouseover", function() {
    d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "red");
    })
        .on("mouseout", function() {
        d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "green");
        });
})