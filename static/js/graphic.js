// this is the section to create the line chart//
// svg container
var height = 600;
var width = 1000;
var padding=100;

// margins
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// chart area minus margins
var chartHeight = height - margin.top - margin.bottom;
var chartWidth = width - margin.left - margin.right;

// create svg container for the federal tax return
var svg = d3.select('#svg_graphic_section').append("svg")
    .attr("height", height)
    .attr("width", width)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// shift everything over by the margins
var chartGroup = svg.append("g")
     .attr("transform", `translate(${margin.left}, ${margin.top})`);
var status = d3.select("#select_status").property("value")

<<<<<<< HEAD
d3.json('/tax_data/${status}',function(err,data){
    console.log(data);
=======
//join the line of income in 2017 and 2018
// read two jsons at the same time.
d3.queue()
  .defer(d3.json,'tax_data/2017')
  .defer(d3.json,'tax_data/2018')
  .await(function(err,data_2017,data_2018){
    // console.log(data);
>>>>>>> a67d0fcb6762087303ba000c3a9a8e83e2839689
    if (err) throw err;
    // console.log('Line 35');
    // data
    // var data = [ { "federal_tax_rate": 1,   "gross_income": 5},  { "federal_tax_rate": 20,  "gross_income": 20},
    //              { "federal_tax_rate": 40,  "gross_income": 10}, { "federal_tax_rate": 60,  "gross_income": 40},
    //              { "federal_tax_rate": 80,  "gross_income": 5},  { "federal_tax_rate": 100, "gross_income": 60}];
    // console.log('Line 42');
    data_2017.forEach(function(tax_point){
        tax_point.federal_tax_rate=+tax_point.federal_tax_rate
        tax_point.gross_income=+tax_point.gross_income
        // tax_point['F']
        //alternative way to create arrays for the svg line chart below
        // taxRateArray.push(+tax_point.federal_tax_rate)
        // incomeArray.push(+tax_point.gross_income)
    })

    // console.log(taxRateArray);
    // console.log(incomeArray);
    // scale y to chart height
    var yScale = d3.scaleLinear()
        .domain(d3.extent(data_2017,d=>d.federal_tax_rate))
        .range([chartHeight, 0]);

    var filingStatusMenu = d3.select("#div_dropdown_list")
    var filingStatus_dropdownList=d3.nest()
            .key(function(d){return d["Filing Status"]})
            .key(function(d){return d["Tax Year"]})
            .entries(data_2017)
     console.log('the dropdown list looks like',filingStatus_dropdownList)

     var filingStatus_dropdownList=
     [
        {'Filing_status':'Single'},
        {'Filing_status':'Married Filing Jointly'},
        {'Filing_status':'Married Filing Separately'}
    ]
        filingStatusMenu
            .append("select")
            .selectAll("option")
            .data(filingStatus_dropdownList)
            .enter()
            .append("option")
            .attr("value", function(d){
                return d.Filing_status;
            })
            .text(function(d){
                return d.Filing_status;
            })


    // scale x to chart width
    var xScale = d3.scaleLinear()
        .domain([0,d3.max(data_2017,d=>d.gross_income)])
        .rangeRound([0, chartWidth])
        // .padding(0.1)
        .nice();

    // create axes

    var yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.format(".2%"));
    var xAxis = d3.axisBottom(xScale).tickFormat(function(d) { return "$" + d3.format(",.2f")(d); });

    // set x to the bottom of the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
    chartGroup.append("g")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Effective Federal Tax Rate");

        // Line generators for each line
    var line1 = d3.line()
        .x(d=>xScale(+d.gross_income))
        .y(d=>yScale(+d.federal_tax_rate))
        // .interpolate("linear");
    // var line2 = d3.line()
    // .x(d => xTimeScale(d.date))
    // .y(d => yLinearScale2(d.smurf_sightings));

// console.log('data: ', [data]);
    // Append a path for line1
   var lineGroup= chartGroup.append("path")
    .attr("d", line1(data_2017))
    .attr("data-legend",function(d) { return '2017'})
    .attr('class','line')
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3)

    chartGroup.append("path")
    .attr('d',line1(data_2018))
    .attr("data-legend",function(d) { return '2018'})
    .attr("fill", "none")
    .attr('class','line')
    .attr("stroke", "orange")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 3)

    // .classed("line green", true)
    // .attr("x", (d, i) => xScale(dataCategories[i]))
    // .attr("y", d => yScale(d));
    // .attr("stroke", "blue")
    // .attr("stroke-width", 2)
    // .attr("fill", "none");

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

//----------------create the state revenue per captial bar chart
var svg_bar = d3.select('#svg_bar_chart_section').append("svg")
    .attr("height", height)
    .attr("width", width);
    // .attr("transform", `translate(${margin.left}, ${margin.top})`);

// shift everything over by the margins
var chartGroup_2 = svg_bar.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json("/states", function(error, state_per_capita_data) {
    state_per_capita_data.forEach(function(d) {
        d.State_Name = d.State_Name;
        d.Revenue_Per_Capita = +d.Revenue_Per_Capita;
    });
    // console.log('the state data',state_per_capita_data)
    // set the x, y axies ranges
    var x = d3.scaleBand()
        .domain(state_per_capita_data.map(d=>d.State_Name))
        .rangeRound([0, chartWidth], .05)
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(state_per_capita_data, d=>d.Revenue_Per_Capita)])
        .range([chartHeight, 0]);
    // define the axis
    var xAxis_bar = d3.axisBottom(x)

    var yAxis_bar = d3.axisLeft(y).tickFormat(function(d) { return "$" + d3.format(",.2f")(d); });	
    // scale the range of the data

    // add axis
    chartGroup_2.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis_bar)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", ".08em")
        .attr("dy", ".05em")
      .attr("transform", "rotate(-45)" )
    //   .text('Top 10 States');


    chartGroup_2.append("g")
        .call(yAxis_bar)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Revenue Per Capita");


  // Add bar chart
var barGroup=chartGroup_2.selectAll(".bar");
        barGroup
        .data(state_per_capita_data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.State_Name); })
        .attr("y", d=>y(d.Revenue_Per_Capita))
        .attr('fill','steelblue')
        .attr("width", x.bandwidth())
        .attr("height", d=> chartHeight - y(d.Revenue_Per_Capita));
    
        // chartGroup_2.append("text")
        // .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        // // .attr("transform", "translate("+ (padding/2) +","+(chartHeight/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        // .text("Per Capita");

        
    // add the text on the bars
    barGroup.selectAll("text")
        .data(state_per_capita_data)
        .enter()
        .append("text")
        .text(function(d) {return d.Revenue_Per_Capita;})
        .attr('text-anchor','middle')
        .attr('font-family',"sans-serif");
        // .attr({
        // "text-anchor": "middle",
        // // x: function(d, i) {
        // //   return i * (w / dataset.length) + (w / dataset.length - padding) / 2;
        // // },
        // // y: function(d) {
        // //   return h - (d * 4) + 14;
        // // // },
        // "font-family": "sans-serif",
        // "font-size": 12,
        // "fill": "#ffffff"
        // });

});

