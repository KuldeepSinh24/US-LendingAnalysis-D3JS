function createMap(functionname,key = "") {
    var svg = d3.select("#choropleth_map");
    var path = d3.geoPath();
    var SCALE = 0.7;
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })

    if (key == "") {
        $("#damage_label").html("Average loan amount requested by all states");
        mydata = d3.nest()
            .key(function (d) {
                return d.StateId;
            })
            .rollup(function (d) {
                return d3.mean(d, function (g) {
                    return g.LoanAmount;
                });
            })
            .entries(dataset);
    } else {
        if(functionname=='statusbar'){
           var message='Offer status: '+key
        }
        else if(functionname=='loanproductname'){
            var message='Product Loan Type: '+key
        }
        else if(functionname=='loanbar'){
            var message='Property use type: '+key
        }
        else if(functionname=='bestoffer'){
            var message='Is Best Offer: '+key
        }
        $("#damage_label").html(message)
        mydata = d3.nest()
            .key(function (d) {
                return d.StateId;
            })
            .rollup(function (d) {
                return d3.mean(d, function (g) {
                    return g.LoanAmount;
                });
            })
            .entries(dataset.filter(function (d) {
                if(functionname=='statusbar'){
                    return d.Status_updated == key; 
                }
                else if(functionname=='loanbar'){
                    
                    return d.PropertUseType_updated==key;
                }
                else if(functionname=='loanproductname'){
                    
                    return d.LoanProductName==key;
                }
                else if(functionname=='bestoffer'){
                    return d.IsBestOffer==key;
                }
            }));
    }

    name_id_map = {};

    for (var i = 0; i < mydata.length; i++) {

        var dataState = mydata[i].key;
        var dataValue = mydata[i].value;
        name_id_map[dataState] = dataValue;
        for (var j = 0; j < usdata.objects.states.length; j++) {
            var jsonState = usdata.objects.states[j].id;

            if (dataState == jsonState) {
                usdata.states[j].properties.value = dataValue;
                break;
            }
        }

    }


    svg.append("g")
        .attr("class", "categories-choropleth")
        .selectAll("path")
        .data(topojson.feature(usdata, usdata.objects.states).features)
        .enter().append("path")
        .attr("d", path)
        .attr("transform", "scale(" + SCALE + ")")
        .style("fill", function (d) {
            var temp = parseInt(d.id, 10)
            if (name_id_map[temp]) {
                var i = quantize(name_id_map[temp]);
                var color = colors[i].getColors();
                return "rgb(" + color.r + "," + color.g +
                    "," + color.b + ")";
            } else {
                return "";
            }
        })
        .on("mouseover", function (d) {
            createBarChart(state_name_map[parseInt(d.id)])
            createPropertUseTypeChart(state_name_map[parseInt(d.id)]);
            createProductLoanTypeChart(state_name_map[parseInt(d.id)]);
            createBestOfferStatus(state_name_map[parseInt(d.id)]);
            var html = "";
            var val = name_id_map[parseInt(d.id)];
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += state_name_map[parseInt(d.id)];
            html += " : ";
            html += formatter.format(val);
            html += "</span>";
            html += "</div>";

            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();

            var coordinates = d3.mouse(this);

            var map_width = $('.categories-choropleth')[0].getBoundingClientRect().width;

            if (d3.event.pageX < map_width / 2) {
                d3.select("#tooltip-container")
                    .style("top", (d3.event.pageY + 15) + "px")
                    .style("left", (d3.event.pageX + 15) + "px");
            } else {
                var tooltip_width = $("#tooltip-container").width();
                d3.select("#tooltip-container")
                    .style("top", (d3.event.pageY + 15) + "px")
                    .style("left", (d3.event.pageX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function () {
            createBarChart()
            createPropertUseTypeChart();
            createProductLoanTypeChart();
            createBestOfferStatus();
            $(this).attr("fill-opacity", "1.0");
            $("#tooltip-container").hide();
        });

    svg.append("path")
        .datum(topojson.mesh(usdata, usdata.objects.states, function (a, b) {
            return a !== b;
        }))
        .attr("class", "categories")
        .attr("transform", "scale(" + SCALE + ")")
        .attr("d", path);


}

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        final = s + (((e - s) / steps) * count);
    return Math.floor(final);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function (_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function () {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}