console.log('mapa');


d3.json('https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json')
.then((city) => {
    console.log(city);
    drawMap(city);
})




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
