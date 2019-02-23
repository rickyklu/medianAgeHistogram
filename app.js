// write your code here!
var width = 800;
var height = 500;
var barPadding = 1;
var padding = 50;
var data = regionData.filter(d => d.medianAge !== null);
var minAge = d3.min(data, d => d.medianAge);
var maxAge = d3.max(data, d => d.medianAge);
var initialBinCount = 16;


var svg = d3.select("svg")
				.attr("width", width)
				.attr("height", height);

var tooltip = d3.select("body")
				.append("div")
				.classed("tooltip", true);


d3.select("input")
	.property("value", initialBinCount)
	.on("input", function(){
		updateRects(+d3.event.target.value)
	});

// axes
svg.append("g")
	.classed("y-axis", true)
	.attr("transform", `translate(${padding}, 0)`);

svg.append("g")
	.classed("x-axis", true)
	.attr("transform", `translate(${0}, ${height-padding})`);

svg.append("text")
	.attr("x", width/2)
	.attr("y", height - 10)
	.style("text-anchor", "middle")
	.text("Median Age");

svg.append("text")
	.attr("x", width/2)
	.attr("y", "1.5em")
	.style("font-size", "1.5em")
	.style("text-anchor", "middle")
	.text("Median Age by Country");

svg.append("text")
	.text("Frequency")
	.attr("transform", "rotate(-90)")
    .attr("y", 15)
    .attr("x", -height/2)
    .attr("dy", "-0.2em")
    .style("text-anchor", "middle")
    .style("z-index", 1);



updateRects(initialBinCount);

// draw and update bars(rectangles)
function updateRects(val){
	var xScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.medianAge))
		.rangeRound([padding, width-padding]);

	var histogram = d3.histogram()
		.domain(xScale.domain())
		.thresholds(xScale.ticks(val))
		.value(d => d.medianAge);

	var bins = histogram(data);

	var yScale = d3.scaleLinear()
		.domain([0, d3.max(bins, d => d.length)])
		.range([height-padding, padding]);

	 	d3.select(".y-axis")
	 		.call(d3.axisLeft(yScale));
		
		d3.select(".x-axis")
			.call(d3.axisBottom(xScale)
				.ticks(val))
			.selectAll("text")
				.attr('y', -3)
				.attr('x', 10)
				.attr("transform", "rotate(90)")
				.style("text-anchor", "start");

		var yAxis = d3.axisLeft(yScale)
		var xAxis = d3.axisBottom(xScale)
	 	var rect = svg
	 				.selectAll("rect")
	 				.data(bins);

	 	rect.exit()
	 		.remove();

	 	rect.enter()
	 		.append('rect')
	 		.merge(rect)
	 		.attr("x", (d,i) => xScale(d.x0))
			.attr("y", d => yScale(d.length))
			.attr("height", d => height - padding - yScale(d.length))
			.attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding)
			.attr("fill", "blue")
			.on("mousemove", d => showTooltip(d))
			.on("touchstart", d => showTooltip(d))
			.on("mouseout", hideTooltip);

		d3.select('.bin-count')
			.text(`Number of bins: ${bins.length}`);
}

function showTooltip(d){
	var text = '<ol>';

	d.forEach(item => {
		text += `<li>Region: ${item.region}, Median Age: ${item.medianAge}</li>`;
	});
	text += '</ol>'

	tooltip
		.style("opacity", 1)
		.style("left", `${d3.event.x - tooltip.node().offsetWidth/2}px`)
		.style("top", `${d3.event.y+25}px`)
		.html(text);

}

function hideTooltip(){
	tooltip
		.style("opacity", 0);

}