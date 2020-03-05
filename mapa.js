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
    // each line has the properties
    const lines = city.features;
    //const price = city.features.properties.avgprice;
    console.log(lines)

    // read each line of the json
    const groupMap = svg
        .append('g')
        .attr('class', 'map');


    const neighbourhoodPath = groupMap.selectAll('.sublines')
        .data(lines)
        .enter()
        .append('path');
    
    neighbourhoodPath.attr('d', d => pathProjection(d))

        // how to hover over the neighbourhood 
        
    neighbourhoodPath.on('click', (d) => {
     
        console.log(d.properties.name)
        console.log(d.properties.avgprice)
        console.log(d.properties.avgbedrooms)
        
    
    }) 

    const MaxAvgPrice = d3.max(lines,  (d) => d.properties.avgprice)
    //const avgPrice = (lines,  (d) => d.properties.avgprice)
    //console.log(avgPrice)
    /*
    function getAvgPrice (city){
        const avgPriceArray = []
        for (i = 0; i < city.features.length; i++){
            avgPriceArray.push(city.features[i].properties.avgprice);

           // console.log(city.features[i].properties.avgprice)
        }
        return avgPriceArray

    }
     
    const price = getAvgPrice(city)
    console.log(price)
    */

    // uses a color scale for the map and fill the map
    const colorScale = d3.scaleSequential().domain([0,MaxAvgPrice])
        .interpolator(d3.interpolateOranges);

    //console.log(colorScale.domain)

    neighbourhoodPath.attr('fill', (d) => colorScale(d.properties.avgprice))
     
    //var myScale = d3.interpolateOranges(MaxAvgPrice)
    //.domain([0,MaxAvgPrice]);

    // creates the legend
    console.log("The range is: " + colorScale.range);

       //creates the legend for the heatmap   
   
    const linear = d3.scaleLinear()
       .domain([0,MaxAvgPrice])
       //.range(["#582406", "#F9C9AD"])
       .range(['white', 'orange'])
       ;
 
     d3.select("svg")
     svg.append("g")
       .attr("class", "legendLinear")
       .attr("transform", "translate(5,30)");
 
     const legendLinear = d3.legendColor()
       .labelFormat(d3.format(".0f"))
       .shapeWidth(35)
       .shapeHeight(30)
       .cells(5)
       .orient('horizontal')
       .scale(linear);
 
     svg.select(".legendLinear")
       .call(legendLinear);


        /* 
    const legendScale = d3.legendColor()
        .scale(colorScale)
        .shapePadding(1)
        .shapeWidth(30)
        .shapeHeight(70)
        .labelOffset(5)
        .ascending(false)
        .cells(5);
        
        
        // .orient(string) - specifies if the legend should be “vertical” or “horizontal”.

    // positions the legend 
    
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr("transform", "translate(5, 30)")
        .call(legendScale);
 
    */
}
