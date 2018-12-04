function createBarChart(state_name = "") {

        $('#bar_chart').empty();

        var svg = d3.select("#bar_chart"),
            margin = {
                top: 10,
                right: 10,
                bottom: 30,
                left: 40
            },
            width = 400 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        var x = d3.scaleBand().range([margin.left, width - margin.right]);
        var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

        var g = svg.append("g")
            .attr("transform", "translate(" +0 + "," + margin.top + ")");

        if (state_name == "") {
            $("#state_label").html("All states");
            mydata = d3.nest()
                .key(function (d) {
                    return d.Status_updated;
                })
                .rollup(function (d) {
                    return d.length;
                    // return d3.sum(d, function (g) {
                    //     return g.LoanAmount;
                    // });
                })
                .entries(dataset);

        } else {
            $("#state_label").html(state_name+'state');
            //console.log(state_name)
            mydata = d3.nest()
                .key(function (d) {
                    return d.Status_updated;
                })
                .rollup(function (d) {
                    return d.length;
                    // return d3.sum(d, function (g) {
                    //     return g.LoanAmount;
                    //     });
                })
                .entries(dataset.filter(function (d) {
                    return d.State == state_name;
                }));
        }

        mydata.sort(function (a, b) {
            
            //console.log(b.value - a.value)
            //console.log(b)
            return a.value - b.value;
        });
    
        y.domain([0, d3.max(mydata, function (d) {
            return d.value;
            
        })]);

        x.domain(mydata.map(function (d) {
            //console.log(d.key)
            return d.key;
        })).padding(0.1);

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            //.attr("transform", "translate(0," + height-margin.bottom + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
            // .ticks(3).tickFormat(function (d) {
            //    //console.log(d)
            //    return d;
            // }));

        g.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        g.selectAll(".bar")
            .data(mydata)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x",function (d) {
                //console.log(d.key)
                return x(d.key);
            } )
            .attr("height", function (d) {
                return y(0)-y(d.value);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .style("fill", function (d) {
                if(d.key=='Accepted'){
                    //console.log(d.value)
                    return '#59a14f'
                }
                else if(d.key=='Rejected'){
                    
                    return '#e15759'
                }
                else{
                    return '#bab0ac'
                }
                // var i = quantize(d.value);
                // var color = colors[i].getColors();
                // return "rgb(" + color.r + "," + color.g +
                //     "," + color.b + ")";
            })
            .on("mousemove", function (d) {
                createMap('statusbar',d.key)
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html((d.key) + "<br>" + "No Of Records: " + (d.value));
            })
            .on("mouseout", function (d) {
                createMap()
                tooltip.style("display", "none");
            });
    }