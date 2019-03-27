// Store SVG width and height parameters 
var svgWidth = 900;
var svgHeight = 600;

// Set SVG margins 
var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

// Create width and height based SVG margins and parameters to fit chart group
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create and append SVG group that contains  states data
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Create  chartGroup that will contain the data
// Use transform attribute to fit data within chart area
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
var dataFile = "assets/data/data.csv"

// Call data from CSV
d3.csv(dataFile).then(successHandle, errorHandle);

// Use error handling to append data and SVG objects
// If error exists log it in console
function errorHandle(error) {
    throw error;
}

// Pull and pass statesData
function successHandle(statesData) { 

  // Loop through the data and pass argument data
  statesData.map(function (data) {
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    });

  // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8.1, d3.max(statesData, d => d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(statesData, d=> d.obesity)])
        .range([height, 0]);
  
  // Create axis functions by calling the scale functions
    var bottomAxis = d3.axisBottom(xLinearScale)

    // Adjust number of ticks for bottom axis  
        .ticks(7);
    
    var leftAxis = d3.axisLeft(yLinearScale)



  // Append axes to chart group 
  // Use height to move bottom axis 
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)

  // Append left axis
    chartGroup.append("g")
        .call(leftAxis)

  // Create Circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.smokes))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")


  // Append text to circles 
  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.smokes))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "10px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([20, 60])
    .html(function (d) {
      return (`${d.state}<br>Smokes: ${d.smokes}%<br>Obesity: ${d.obesity}% `);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // Create onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
    .attr("class", "axisText")
    .text("Smoke (%)");
}