console.log('mapa y barras');


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


  // how to hover over the neighbourhood 
    const sample = neighbourhoodPath.on('click', (d) => {
     
        //console.log(d.properties.name)
        //console.log(d.properties.avgprice)
        //console.log(d.properties.avgbedrooms)

        //console.log(d.properties.avgbedrooms[1].bedrooms)
        //console.log(d.properties.avgbedrooms[1].total)
        const avgbedrooms = d.properties.avgbedrooms
        
        const numBedrooms = []
        const numTotalBedrooms = []
        const Lengtharray = d.properties.avgbedrooms.length
        for (i = 0; i < Lengtharray; i++){
            // the numBedrooms should come from d.properties.avgbedrooms[i].bedrooms
            // but since json has an error on this, I am taking only the index
            numBedrooms.push(i) 
            numTotalBedrooms.push(d.properties.avgbedrooms[i].total)
        }
        
        console.log(numBedrooms)
        console.log(numTotalBedrooms)
    

        const svgBars = d3.select('#practicabmb')
            .append('svg');
    
    
        svgBars
            .attr('width', width)
            .attr('height', height);

        const border = 100 
        const x = d3.scaleBand()
            .domain(numBedrooms)
            .range([0+border, width - border])
            .padding(0.4);
        
        const y = d3.scaleLinear()
            .domain(d3.extent(numTotalBedrooms))
            .range([height - border, 0 + border]);
        
        const group = svgBars.append('g');

        const axisY = d3.axisLeft(y).ticks(10);
        group.append('g')
            .attr('transform', `translate(${border}, 0)`)
            .call(axisY);

        const axisX = d3.axisBottom(x).ticks(5);
        group.append('g')
            .attr('transform', `translate(0, ${height - border})`)
            .call(axisX);



        x.domain(numBedrooms.map(d => numBedrooms))
        y.domain([0, d3.max(avgbedrooms, d => d.total)]).nice()
        console.log(x)
        console.log(y)

        // maxInput = d3.max(numTotalBedrooms); 
        // function scale(d) {
        //     const scaleNum = (height - 20) / maxInput;
        //     return scaleNum * d;
        // }
              
        // function posX(d, index) {
        //     return index * (rectWidth + 1);
        // }
              
        // function posY(d) {
        //     return height - scale(d);
        // }

        const barWidth = 60;
        group
            .selectAll('.bar')
            .data(numTotalBedrooms)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', function (data, i) {
                return (i * (barWidth + 50)) + 2*border;
            })
            .attr('y', function (data) {
                console.log(data)
                return height - data;
            })
            //.attr("x", posX)
            //.attr("y", posY)
            .attr("width", barWidth)
            .attr("height", height - 10);

    
        


    })


    /////////////////////////////////////////////////////////////////////
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

