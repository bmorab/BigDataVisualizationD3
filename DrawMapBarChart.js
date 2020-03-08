console.log('mapa y barras');


d3.json('https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json')
.then((city) => {
    console.log(city);
    drawMap(city);
})


// function to draw the map and bar chart
function drawMap(city) {
    const svg = d3.select('#practicabmb')
    .append('svg')

    // creates svg object
    const width = 1000;
    const height = 1000;
    const border = 50
    
    // creates svg object
    svg.attr('width', width)
    svg.attr('height', height);

    // creates projection where to draw map
    // converting latitude/longitud into pixel cartersian coordinates
    const centermap = d3.geoCentroid(city);
    const coordinates =  d3.geoMercator()
      .fitSize([width, height], city)
      .center(centermap)
      .translate([width/2 + border, height/2])

    // converts list of coordenates into svg
    const pathProjection = d3.geoPath().projection(coordinates);

    // Inside the city collections, we want to access to each line of the json
    // each line has the properties
    const lines = city.features;
    

   // Creates a group for the map object
    const groupMap = svg
        .append('g')
        .attr('class', 'map');

    // reads each line from the city.features
    const neighbourhoodPath = groupMap.selectAll('.sublines')
        .data(lines)
        .enter()
        .append('path');
    
    neighbourhoodPath.attr('d', d => pathProjection(d))


  // how to hover over the neighbourhood 
    const sample = neighbourhoodPath.on('click', (d) => {
         
        // Creates arrays with number of bedrooms in a house and 
        // number of apartaments for each apparment-number of bedrooms
        const numBedrooms = []
        const numTotalBedrooms = []
        const Lengtharray = d.properties.avgbedrooms.length
        for (i = 0; i < Lengtharray; i++){
            // the numBedrooms should come from d.properties.avgbedrooms[i].bedrooms
            // but since json has an error on this, I am taking only the index
            numBedrooms.push(i) 
            numTotalBedrooms.push(d.properties.avgbedrooms[i].total)
        }
        
   
        // Creates a new svg where the barchart is going to be drawn
        const svgBars = d3.select('#practicabmb')
            .append('svg');
        
        svgBars
            .attr('width', width)
            .attr('height', height);

        // creates the scale for X and Y based on the two arrays created
        // previously            
        const border = 100 
        const scaleX= d3.scaleBand()
            .domain(numBedrooms)
            .range([0+border, width - border])
        
        const scaleY = d3.scaleLinear()
            .domain([0, d3.max(numTotalBedrooms)])
            .range([height - border, 0 + border]);
        
        const group = svgBars.append('g');

        // draws X and Y axis
        const axisY = d3.axisLeft(scaleY).ticks(10);
        group.append('g')
            .attr('transform', `translate(${border}, 0)`)
            .call(axisY);

        const axisX = d3.axisBottom(scaleX).ticks(5);
        group.append('g')
            .attr('transform', `translate(0, ${height - border})`)
            .call(axisX);

        // draws bars with data from arrays
        const stepsX = ((width - 2*border) / Lengtharray)
        const barWidth = 60;
        group
            .selectAll('.bar')
            .data(numTotalBedrooms)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', function (data, i) {
                return stepsX * (i + 1);
            })
            .attr('y', function (data) {
                return scaleY(data);
            })
            .attr("width", barWidth)
            .attr("height",  function (data) {
                   return height - scaleY(data) - border
            })
           

        // set the text in the graph for axis and title
        const textOffset = 50
        group
            .append('text')
            .attr('text-anchor', 'end')
            .attr('x', width / 2 + border )
            .attr('y', height - textOffset )
            .text('Numero de habitaciones');

        group
            .append('text')
            .attr('text-anchor', 'middle')
            .attr("transform", "rotate(-90)")
            .attr("y", textOffset)
            .attr("x", -(width / 2))
            .text('Numero de apartamentos');

        group
            .append('text')
            .attr("font-size","35px")
            .attr('x', width / 2 + (2 * border))
            .attr('y', textOffset )
            .attr('text-anchor', 'middle')
            .text("Barrio: " + d.properties.name);
    })


    const MaxAvgPrice = d3.max(lines,  (d) => d.properties.avgprice)
    
    // uses a color scale for the map and fill the map
    const colorScale = d3.scaleSequential().domain([0,MaxAvgPrice])
        .interpolator(d3.interpolateOranges);

    neighbourhoodPath.attr('fill', (d) => colorScale(d.properties.avgprice))
    
    
    //creates the legend for the heatmap   
    const legendScale = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .scale(colorScale)
        .shapePadding(1)
        .shapeWidth(30)
        .shapeHeight(70)
        .labelOffset(5)
        .ascending(false)
        .title("Precios Medios")
        .cells(5);
              

    // positions the legend 
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr("transform", "translate(5, 30)")
        .call(legendScale);
     
}

