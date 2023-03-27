function finalproject(){
    var filePath="data.csv";
    question0(filePath);
    question1(filePath);
    question2(filePath);
    question3(filePath);
    question4(filePath);
    question5(filePath);
}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
        console.log(data)
    });
}

var question1=function(filePath){
    d3.csv(filePath).then(function(data){
        var data1 = data.filter(function(d){ return d.data_quality == "1"});
        var data2 = data1.filter(function(d) { return d.x55 != ""});
        var data3 = data2.filter(function(d) { return d.x54 != ""});
        var data4 = d3.rollup(data3, v => d3.mean(v, d => parseFloat(d.x54)), d => d.country, d => d.x55)

        var arr = Array.from(data4)
        var data = []
        for (let i = 0; i < arr.length; i++){
            var arr2 = Array.from(arr[i][1])
            if (arr2.length > 7) {
                for (let j = 0; j < arr2.length; j++) {
                dict = {}
                dict["country"] = arr[i][0]
                dict["percent"] = arr2[j][0]
                dict["mean"] = arr2[j][1]
                data.push(dict)
                }
            }
        }
        var countries = [];
        for (var i = 0; i < data.length; i++) {
            if (countries.indexOf(data[i].country) === -1) {
                countries.push(data[i].country);
            }
        }

        var svgwidth = 487.5;
        var svgheight = 500;
        var pad = 45;

        var svg = d3.select("#q1_plot").append("svg").attr("width", svgwidth).attr("height", svgheight);

        d3.select("#selectButton")
                .selectAll('options')
                .data(countries)
                .enter()
                .append('option')
                .attr("name", "country")
                .attr("type", "selection")
                .text(function (d) { return d; })
                .attr("value", function (d) { return d; })

        var current_year = "India";
        var default_data = data.filter(function(d){ return d.country == "India"});

        let colors = d3.scaleOrdinal()
                                .domain(countries)
                                .range(d3.schemeSet3);

        let xScale = d3.scaleLinear()
                    .domain([0, d3.max(default_data, d=> parseFloat(d.percent))+2])
                    .range([pad, svgwidth - pad]);

        let yScale = d3.scaleLinear()
                    .domain([0, d3.max(default_data, d=> parseInt(d.mean))])
                    .range([svgheight - pad, pad]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
                    .attr("class", "x_axis")
                    .attr("transform", "translate(0," + (svgheight - pad) + ")")
                    .call(xAxis);

        svg.append("g")
                    .attr("class", "y_axis")
                    .attr("transform", "translate(" + pad + ",0)")
                    .call(yAxis);

        svg.selectAll('circle')
                .data(default_data)
                .enter().append('circle')
                .attr("class", "default_circle")
                .attr('fill', d=> colors(d.countries))
                .attr("cx", d=> xScale(parseFloat(d.percent)))
                .attr("cy", d=> yScale(parseFloat(d.mean)))
                .attr("r", 3);


        var radio = d3.selectAll('#selectButton')
                .on("change", function (d) {
                    var current_location = d3.select(this).node().value;
                    current = data.filter(function(d){ return d.country == current_location});

                    yScale = d3.scaleLinear()
                        .domain([0, d3.max(current, d=> parseInt(d.mean))])
                        .range([svgheight - pad, pad]);

                    xScale = d3.scaleLinear()
                        .domain([0, d3.max(current, d=> parseFloat(d.percent))+2])
                        .range([pad, svgwidth - pad]);

                    colors = d3.scaleOrdinal()
                                .domain(current_location)
                                .range(d3.schemeSet3);

                    y_axis = d3.axisLeft(yScale);
                    x_axis = d3.axisBottom(xScale);

                    d3.selectAll("g.y_axis").remove();
                    d3.select("g.x_axis").remove();

                    svg.append("g")
                        .attr("class", "x_axis")
                        .attr("transform", "translate(0," + (svgheight - pad) + ")")
                        .call(x_axis);

                    svg.append("g")
                        .attr("class", "y_axis")
                        .attr("transform", "translate(" + pad + ",0)")
                        .call(y_axis);


                    d3.selectAll("[class=default_circle]").remove()
                    svg.selectAll('circle').data(current).enter().append('circle').attr('class','default_circle')
                        .style('fill', d => colors(d.countries))
                        .attr("cx", d=> xScale(parseFloat(d.percent)))
                        .attr("cy", d=> yScale(parseFloat(d.mean)))
                        .attr("r", 3);
              })

    svg.append('text')
        .attr('x', svgwidth/2)
        .attr('y', svgheight-5)
        .style('text-anchor', 'middle')
        .text('Mortgage Interest Rate in Percentages (%)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -svgheight/2)
        .attr('y', 12)
        .style('text-anchor', 'middle')
        .text('Average Monthly Net Salary ($)');
    });
   

}
//
var question2=function(filePath){
    d3.csv(filePath).then(function(data){
        var data1 = data.filter(function(d){ return d.data_quality == "1"});
        var data2 = data1.filter(function(d) { return d.x2 != ""});
        var data3 = d3.rollup(data2, v => v.length, d => d.country, d => d.x2);
        
        var arr = Array.from(data3)
        var data4 = []
        for (let i = 0; i < arr.length; i++){
            var arr2 = Array.from(arr[i][1])
            if (arr2.length > 3) {
                for (let j = 0; j < arr2.length; j++) {
                dict = {}
                dict["country"] = arr[i][0]
                dict["median_meal"] = arr2[j][0] * arr2[j][1]
                data4.push(dict)
                }
            }
        }

        var data5 = d3.rollup(data4, v => d3.median(v, d => parseFloat(d.median_meal)), d => d.country)
        var arr = Array.from(data5)
        var data = []
        for (let i = 0; i < arr.length; i++){
            dict = {}
            dict["country"] = arr[i][0]
            dict["median_meal"] = arr[i][1]
            data.push(dict)
        }
        var dataSort = data.slice().sort((a, b) => d3.ascending(a.median_meal, b.median_meal));

        var svgheight = 400;
        var svgwidth = 1100;
        var pad = 55.5;

        var svg = d3.select("#q2_plot").append("svg")
                .attr("width", svgwidth)
                .attr("height", svgheight);

        var xScale = d3.scaleBand()
                        .domain(dataSort.map(function(d) { return d.country;}))
                        .range([pad, svgwidth-pad])
                        .paddingOuter(0.15)
                        .paddingInner(0.15);

        let yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataSort, d=> parseInt(d.median_meal))])
                        .range([svgheight - pad, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.selectAll("rect")
                .data(dataSort)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .on("mouseover", function(event, d){            
                        d3.select(this)
                            .attr("fill", "orange")

                    })
                    .on("mouseout", function(event, d){
                        d3.select(this)
                            .transition()
                            .duration(100)
                            .attr("fill", "#7FB3D5")
                    })
                .attr("width", xScale.bandwidth())
                .attr("height", 0)
                .attr("x", function(d) {
                    return xScale(d.country);
                })
                .attr("y", yScale(0))
                .attr("fill", "#7FB3D5");
        svg.selectAll("rect")
        .transition("sorting")
        .duration(2500)
        .attr("height", function(d) {
                    return svgheight - yScale(parseInt(d.median_meal)) - pad;
                })
        .attr("y", function(d) {
                    return yScale(parseInt(d.median_meal));


                })



        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (svgheight - pad) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end")
                    .style("font-size", "7px");
            
        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + pad + ",0)")
                    .call(yAxis);

        svg.append('text')
        .attr('x', svgwidth/2)
        .attr('y', svgheight-2)
        .style('text-anchor', 'middle')
        .text('Countries');

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -svgheight/2)
        .attr('y', 12)
        .style('text-anchor', 'middle')
        .text('Median Price of Meal for 2 People ($)');
  
    });
    
}

var question3=function(filePath){
    d3.csv(filePath).then(function(data){
        var data1 = data.filter(function(d){ return d.data_quality == "1"});
        var data2 = data1.filter(function(d) { return d.x52 != ""});
        var data3 = data2.filter(function(d) { return d.x53 != ""});
        var data4 = d3.rollup(data2, v => v.length, d => d.country); 
        var arr = Array.from(data4)
        var count = []
        for (let i = 0; i < arr.length; i++){
            if (arr[i][1] > 7) {
                count.push(arr[i][0])
            }
        }
        var data5 = data3.filter(function(d,i){ return count.indexOf(d.country) >= 0 });

        var data6 = d3.rollup(data5, v=> Object.fromEntries(["x52", "x53"].map(c => [c, d3.mean(v, d => parseFloat(d[c]))])), d=> d.country) 
        var arr = Array.from(data6)
        var data = []
        for (let i = 0; i < arr.length; i++){
            dict = {"Country": "", "City Centre": 0, "Outside of Centre": 0,}
            dict["Country"] = arr[i][0]
            dict["City Centre"] = arr[i][1].x52
            dict["Outside of Centre"] = arr[i][1].x53
            data.push(dict)
            }

        var stack =  d3.stack()
                        .keys(["City Centre", "Outside of Centre"])

        var series = stack(data);

        var svgheight = 500;
        var svgwidth = 500;
        var pad = 55;

        var svg = d3.select("#q3_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth);

        var xScale = d3.scaleBand()
                        .domain(data.map(function(d) { return d.Country;}))
                        .range([pad, svgwidth-pad])
                        .paddingOuter(0.15)
                        .paddingInner(0.15);

        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, function(d){ 
                            return (d["City Centre"] + d["Outside of Centre"]);
                        })])
                        .range([svgheight-pad, 0]);

        var colors = d3.scaleOrdinal()
                            .domain(data.map(function(d) { return d.Country;}))
                            .range(["#DC7633", "#EDBB99"]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        var Tooltip = d3.select("#q3_plot")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "tooltip")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("border", "1px solid #000000");

        var mouseover = function(e, d) {
                    Tooltip
                    .style("opacity", 1)
            }
        var mousemove = function(event, d) {
            var group = d3.select(this.parentNode).datum().key;
            var num = d.data[group];
                    Tooltip
                        .html(group + ": $" +(d3.format(".2f")(num)))
                        .style("left", (d3.pointer(event)[0]+575) + "px")
                        .style("top", (d3.pointer(event)[1]+250) + "px");
                        }
        var mouseleave = function(d) {
                Tooltip
                .style("opacity", 0)
  }

        var groups = svg.selectAll("g")
                    .data(series)
                    .enter()
                    .append("g")
                    .style("fill", function(d) { return colors(d.key); })

        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (svgheight - pad) + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("transform", "rotate(-45)")
                    .style("text-anchor", "end")
                    .style("font-size", "7px");
            
        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + pad + ",0)")
                    .call(yAxis);

        var rects = groups.selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return xScale(d.data.Country);
                })
                .attr("y", function(d) {
                    return yScale(d[1]);
                })
                .attr("height", function(d) {
                    return (yScale((d[0])) - yScale(d[1]));
                })
                .attr("width", xScale.bandwidth())
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);

        svg.append('text')
        .attr('x', svgwidth/2)
        .attr('y', svgheight-2)
        .style('text-anchor', 'middle')
        .text('Countries');

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -svgheight/2)
        .attr('y', 10)
        .style('text-anchor', 'middle')
        .style("font-size", "10px")
        .text('Price per Square Meter of Apartment($)');

        svg.selectAll("box")
            .data(["City Centre", "Outside of Centre"])
            .enter()
            .append("rect")
            .attr("x", svgwidth/2)
            .attr("y", function(d,i){ return i*(pad+5)})
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", function(d){ return colors(d)})

        svg.selectAll("name")
            .data(["City Centre", "Outside of Centre"])
            .enter()
            .append("text")
            .attr("x", svgwidth/2+25)
            .attr("y", function(d,i){ return i*(pad)+18})
            .attr("width", 20)
            .attr("height", 20)
            .text(function(d){ return d})
    });
}

var question4=function(filePath){
    d3.csv(filePath).then(function(data){
        //var data1 = data.filter(function(d){ return d.data_quality == "1"});
        var data1 = data.filter(function(d) { return d.x36 != ""});
        var data2 = d3.rollup(data1, v => d3.mean(v, d => d.x36), d=> d.country)
        var arr = Array.from(data2)
        var data = []
        for (let i = 0; i < arr.length; i++){
            dict = {"country": "", "average_basics": 0}
            dict["country"] = arr[i][0]
            dict["average_basics"] = arr[i][1]
            data.push(dict)
        }
        
        var svgwidth=1000;
        var svgheight=600;
        var pad=50;

        var svg = d3.select("#q4_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth);
     
        const projection  = d3.geoNaturalEarth1().translate([svgwidth/2, svgheight/2])
                                   .scale([200]);

        const geopath = d3.geoPath()
                             .projection(projection);

        const world = d3.json('world.json');

        let zoom = d3.zoom()
                .scaleExtent([0.5, 1.5])
                .on('zoom', (event) => {
                    svg.attr('transform', event.transform);
                    });

        var logScale = d3.scaleLog()
  .domain([d3.min(data, function(d) { return (d.average_basics); }), 
                    d3.max(data, function(d) { return (d.average_basics); })])
  .range([0, svgwidth]);

        var colors = d3.scaleSequential().domain([d3.min(data, function(d) { return logScale(d.average_basics); }), 
                    d3.max(data, function(d) { return logScale(d.average_basics); })]).interpolator(d3.interpolateYlGn).unknown("#ccc")

        world.then(function (map) {
            for (let i =0; i < data.length; i++){
                    var country = data[i].country;
                    var average = data[i].average_basics
                    for (let j =0; j < map.features.length; j++) {
                        if (map.features[j].properties.name == "USA") {
                            map.features[j].properties.name = "United States"
                        }
                        if (map.features[j].properties.name == "United Republic of Tanzania") {
                            map.features[j].properties.name = "Tanzania"
                        }
                        if (map.features[j].properties.name == "China") {
                            map.features[j].properties.name = "Hong Kong"
                        }
                        if (map.features[j].properties.name == "Republic of Serbia") {
                            map.features[j].properties.name = "Serbia"
                        }

                        if (map.features[j].properties.name == country) {
                            map.features[j].properties.val = average;
                        }
                    }
                }
        svg.selectAll('path')
                .data(map.features)
                .enter()
                .append('path')
                .attr('d', geopath)
                .style("stroke-width", 0.7)
                .style("stroke", "black")
                .style("fill", function(d) { {
                        return colors(logScale(d.properties.val))
                    }
                })
                .call(zoom);})
        var legend = svg.append("linearGradient")
                                    .attr("id", "gradient");

        legend.selectAll("bar")
                .data(colors.range())
                .enter().append("stop")
                .attr("offset", (d, i) => i / (colors.range().length - 1))
                .attr("stop-color", d => d);

        svg.append("rect")
                .attr("width", 300)
                .attr("height", 20)
                .style("fill", "url(#gradient)")
                .attr("x", svgwidth-pad-pad-pad-pad-pad-pad-pad)
                .attr("y", svgheight-pad-pad-20);


        var label = d3.scaleLinear()
                                .domain([0, 
                    d3.max(data, function(d) { return (d.average_basics); })])
                                .range([0, 300]);

        var label = d3.axisBottom(label);

        svg.append("g")
            .attr("transform", "translate("+ (svgwidth-pad-pad-pad-pad-pad-pad-pad)+ "," + (svgheight-pad-pad) + ")")
            .call(label)
            .style("font-size", "10px");
        svg.append('text')
        .attr('x', svgwidth-pad-pad-pad-pad)
        .attr('y', svgheight-pad-pad-20)
        .style('text-anchor', 'middle')
        .text('Price of Basics ($)')
        .style("font-size", "10px");
    });
}

var question5=function(filePath){
    d3.csv(filePath).then(function(data){
        var data1 = data.filter(function(d){ return d.data_quality == "1"});
        var data2 = data1.filter(function(d) { return d.x16 != ""});
        var data3 = data2.filter(function(d) { return d.x20 != ""});
        var data4 = data3.filter(function(d) { return d.x22 != ""});
        var apple = data4.map(function(d) { return parseFloat(d.x16); });
        var potato = data4.map(function(d) { return parseFloat(d.x20); });
        var lettuce = data4.map(function(d) { return parseFloat(d.x22); });
        
        var items = [apple, potato, lettuce];
        var keys = ["apple", "potato", "lettuce"];

        var data = items.map(function(d) {
            return {
                q1: d3.quantile(d.sort(d3.ascending), .25),
                med: d3.quantile(d.sort(d3.ascending), .5),
                q3: d3.quantile(d.sort(d3.ascending), .75),
                min: d3.min(d),
                max: d3.max(d)
                    };
            });

        var svgwidth=500;
        var svgheight=500;
        var pad=50;

        var svg = d3.select("#q5_plot").append("svg")
                .attr("height", svgheight)
                .attr("width", svgwidth);

        var xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return d.max; })])
                .range([pad, svgheight-pad]);

        var yScale = d3.scaleBand()
                .domain(keys)
                .range([svgwidth-pad, 0])
                .paddingInner(0.15)
                .paddingOuter(0.15);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale).tickSize(0);

        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0," + (svgheight - pad) + ")")
                    .call(xAxis);
            
        svg.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(" + pad + ",0)")
                    .call(yAxis)
                    .select(".domain").remove();

        svg.selectAll("box")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", function(d, i) { return yScale(keys[i]); })
            .attr("x", function(d) { return xScale(d.q1); })
            .attr("width", function(d) { return xScale(d.q3) - xScale(d.q1); })
            .attr("height", yScale.bandwidth())
            .attr("stroke", "black")
            .attr("fill", "white");

        svg.selectAll("lines")
            .data(data)
            .enter()
            .append("line")
            .attr("y1", function(d, i){return(yScale(keys[i])+60)})
            .attr("y2", function(d, i){return(yScale(keys[i])+60)})
            .attr("x1", function(d){return(xScale(d.min))})
            .attr("x2", function(d){return(xScale(d.max))})
            .attr("stroke", "black")
            .style("width", 40);

        svg.selectAll("med")
            .data(data)
            .enter()
            .append("line")
            .attr("y1", function(d, i){return(yScale(keys[i])+60)})
            .attr("y2", function(d,i){return(yScale(keys[i]))})
            .attr("x1", function(d){return(xScale(d.med))})
            .attr("x2", function(d){return(xScale(d.med))})
            .attr("stroke", "black")
            .style("width", 20);

        svg.append('text')
        .attr('x', svgwidth/2)
        .attr('y', svgheight-2)
        .style('text-anchor', 'middle')
        .style("font-size", "14px")
        .text('Price per Item ($)');

        svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -svgheight/2)
        .attr('y', 10)
        .style('text-anchor', 'middle')
        .style("font-size", "16px")
        .text('Item Names');


    });
}




