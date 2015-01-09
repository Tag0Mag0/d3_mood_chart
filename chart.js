      function columnChart(lowBound, highBound) {
        var margin = {top: 30, right: 10, bottom: 50, left: 50},
            width = 420,
            height = 420,
            xRoundBands = 0.2,
            xValue = function(d) { return d.day; },
            yValue = function(d) { return d.intensity; },
            xScale = d3.scale.ordinal(),
            yScale = d3.scale.linear(),
            yAxis = d3.svg.axis().scale(yScale).orient("left"),
            xAxis = d3.svg.axis().scale(xScale);


        function chart(selection) {
          selection.each(function(data) {

            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            data = data.map(function(d, i) {
              return [xValue.call(data, d, i), yValue.call(data, d, i)];
            });

            // Update the x-scale.
            xScale
                .domain(data.map(function(d) { return d[0];} ))
                .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);


            // Update the y-scale.
            yScale
                .domain([lowBound, highBound])
                .range([height - margin.top - margin.bottom, 0])
                .nice();


            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "bars");
            gEnter.append("g").attr("class", "y axis");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "x axis zero");

            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height)
                .append("text")
                .attr("x", graphWidth/2)
                .attr("y", 25)
                .attr("font-size",25)
                .attr("font-family","sans-serif")
                .attr("text-anchor","middle")
                .attr("font-weight","bold")
                .text("Positive and Negative Emotions");

            // draw average line
            var values = d3.map(data, function(d, i) { return d[1]; }).keys();
            svg .append("rect")
                .attr("class", "average-line")
                .attr("width", width)
                .attr("height", 5)
                .attr("x", xScale(0))
                .attr("y", height - yScale(d3.mean(values)));

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

           // Update the bars.
            var bar = svg.select(".bars").selectAll(".bar").data(data);
            bar.enter().append("rect");
            bar.exit().remove();
            bar .attr("class", function(d, i) { return d[1] < 0 ? "bar negative" : "bar positive"; })
                .attr("x", function(d) { return X(d); })
                .attr("y", function(d, i) { return d[1] < 0 ? Y0() : Y(d); })
                .attr("width", xScale.rangeBand())
                .attr("height", function(d, i) { return Math.abs( Y(d) - Y0() ); });

          // x axis at the bottom of the chart
           g.select(".x.axis")
              .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
              .call(xAxis.orient("bottom"));

          // zero line
           g.select(".x.axis.zero")
              .attr("transform", "translate(0," + Y0() + ")")
              .call(xAxis.tickFormat("").tickSize(0));


            // Update the y-axis.
            g.select(".y.axis")
              .call(yAxis);

          });
        }


      // The x-accessor for the path generator; xScale ∘ xValue.
        function X(d) {
          return xScale(d[0]);
        }

        function Y0() {
          return yScale(0);
        }

        // The x-accessor for the path generator; yScale ∘ yValue.
        function Y(d) {
          return yScale(d[1]);
        }

        chart.margin = function(_) {
          if (!arguments.length) return margin;
          margin = _;
          return chart;
        };

        chart.width = function(_) {
          if (!arguments.length) return width;
          width = _;
          return chart;
        };

        chart.height = function(_) {
          if (!arguments.length) return height;
          height = _;
          return chart;
        };

        chart.x = function(_) {
          if (!arguments.length) return xValue;
          xValue = _;
          return chart;
        };

        chart.y = function(_) {
          if (!arguments.length) return yValue;
          yValue = _;
          return chart;
        };

        return chart;
      }
