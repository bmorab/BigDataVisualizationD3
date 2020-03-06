console.log('bars');


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
    svg.attr('width', width)
    svg.attr('height', height);

    // creates projection where to draw map
    // converting latitude/longitud into pixel cartersian coordinates
    const border = 50
    const centermap = d3.geoCentroid(city);
    const coordinates =  d3.geoMercator()
      .fitSize([width, height], city)
      .center(centermap)
      .translate([width/2 + border, height/2])

    // converts list of coordenates into svg
    const pathProjection = d3.geoPath().projection(coordinates);

    // Inside the city collections, we want to access to each line of the json
    const lines = city.features;
    //const price = city.features.properties.avgprice;


    // read each line of the json
    const groupMap = svg
        .append('g')
        .attr('class', 'map');


    const neighbourhoodPath = groupMap.selectAll('.sublines')
        .data(lines)
        .enter()
        .append('path');
    
    neighbourhoodPath.attr('d', d => pathProjection(d))



    //console.log(d.properties.name)

        // how to hover over the neighbourhood 
    const sample = neighbourhoodPath.on('click', (d) => {
     
        console.log(d.properties.name)
        console.log(d.properties.avgprice)
        console.log(d.properties.avgbedrooms)

        console.log(d.properties.avgbedrooms.bedrooms)
        console.log(d.properties.avgbedrooms.total)
        const bedroomsArray = [d.properties.avgbedrooms] 
        
        console.log(bedroomsArray)
        console.log(bedroomsArray[0].bedrooms)

        /*
        for (i = 0; i < bedroomsArray.length; i++){
            avgPriceArray.push(city.features[i].properties.avgbedrooms.bedrooms);

            console.log(city.features[i].properties.avgprice)
        }

                /*
        function getAvgPrice (city){
            const avgPriceArray = []
            for (i = 0; i < city.features.length; i++){
                avgPriceArray.push(city.features[i].properties.avgbedrooms.bedrooms);
    
                console.log(city.features[i].properties.avgprice)
            }
            return avgPriceArray
        }*/
            
       const input = [5, 10, 15, 20];
       const maxInput = d3.max(input);
       
       const svgBars = d3.select('#practicabmb')
        .append('svg');
       
       
       svgBars
        .attr('width', width)
        .attr('height', height);

         /*   
        const scaleY = d3.scaleLinear()
          .domain(d3.extent(parser, (d) => d.value))
          .range([height, 0]);

*/
       
    })
    
    // uses a color scale for the map and fill the map
    const colorScale = d3.scaleOrdinal(d3.schemeBlues[9]);
    //.domain([d3.min(d.properties.avgprice), d3.max(d.properties.avgprice)]);
   

    neighbourhoodPath.attr('fill', (d) => colorScale(d.properties.avgprice))

    // const range = [min(d.properties.avgprice), max(d.properties.avgprice)];
    //colorScale.domain(range);
    
    // creates the legend
    const legendScale = d3.legendColor()
        .scale(colorScale)
        .shapePadding(1)
        .shapeWidth(30)
        .shapeHeight(70)
        .labelOffset(5)
        .ascending(false);
        
        
        // .orient(string) - specifies if the legend should be “vertical” or “horizontal”.

    // positions the legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr("transform", "translate(5, 30)")
        .call(legendScale);
 
            

}


/////////////////////////////////////////////////////////


