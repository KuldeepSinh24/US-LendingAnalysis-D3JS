function createProductLoanTypeChart(state_name = "") {

    $('#product_loan_bar_chart').empty();

    var svg = d3.select("#product_loan_bar_chart"),
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
        $("#state_label_prdloantype").html("All");
        mydata = d3.nest()
            .key(function (d) {
                if (d.LoanProductName == '15YearFixed') { return '15 Yr Fixed'; }
                else if (d.LoanProductName == 'VA 15 Yr Fixed') {
                    return '15 Yr Fixed';
                }
                else if (d.LoanProductName == '30YearFixed') { return '30 Yr Fixed'; }
                else if (d.LoanProductName == 'VA 30 Yr Fixed') { return '30 Yr Fixed'; }
                else if (d.LoanProductName == '5/1 ARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == '5YearARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == 'FNMA 5/1 ARM') { return 'FNMA 5 Yr ARM'; }
                else if (d.LoanProductName == 'VA 5 Yr ARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == '7/1 ARM') { return '7 Yr ARM'; }
                else if (d.LoanProductName == 'FNMA 7/1 ARM') { return 'FNMA 7 Yr ARM'; }
                else { return d.LoanProductName; }
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(dataset);

    } else {
        console.log(state_name)
        $("#state_label_prdloantype").html(state_name);
        mydata = d3.nest()
            .key(function (d) {
                if (d.LoanProductName == '15YearFixed') { return '15 Yr Fixed'; }
                else if (d.LoanProductName == 'VA 15 Yr Fixed') {
                    return '15 Yr Fixed';
                }
                else if (d.LoanProductName == '30YearFixed') { return '30 Yr Fixed'; }
                else if (d.LoanProductName == 'VA 30 Yr Fixed') { return '30 Yr Fixed'; }
                else if (d.LoanProductName == '5/1 ARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == '5YearARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == 'FNMA 5/1 ARM') { return 'FNMA 5 Yr ARM'; }
                else if (d.LoanProductName == 'VA 5 Yr ARM') { return '5 Yr ARM'; }
                else if (d.LoanProductName == '7/1 ARM') { return '7 Yr ARM'; }
                else if (d.LoanProductName == 'FNMA 7/1 ARM') { return 'FNMA 7 Yr ARM'; }
                else { return d.LoanProductName; }
            })
            .rollup(function (d) {
                return d.length;
            })
            .entries(dataset.filter(function (d) {
                return d.State == state_name;
            }));
    }

    mydata.sort(function (a, b) {
        return a.value - b.value;
    });

    y.domain([0, d3.max(mydata, function (d) {
        return d.value;
    })]);

    x.domain(mydata.map(function (d) {
        return d.key;
    })).padding(0.1);

    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");
                // .ticks(5).tickFormat(function (d) {
                //     return parseInt(d / 1000);
                // }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(mydata)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
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
            return '#4e79a7';
        })
        .on("mouseover", function (d) {
            createMap('loanproductname',d.key)
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