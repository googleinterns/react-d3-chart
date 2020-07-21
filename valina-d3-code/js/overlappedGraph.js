let clip;
let lineCharts = [];
let x, y, x2, y2;
let margin, margin2, width, height, height2;
let context;
let lineChart;
let color = d3.scaleOrdinal(d3.schemeCategory10);
let line, line2;
let zoom;

let groupValuesByX = {};

function setUpOverlappedGraph(graphData) {
  const data = graphData['trace'][0]['c3'].map(
      (value, index) => ({value, time: index}));
  const svg = d3.select('#data-vis-result').append('svg');

  svg.attr('width', 960).attr('height', 500).attr('id', 'overlapped-chart');
  margin = {top: 20, right: 20, bottom: 110, left: 40};
  margin2 = {top: 430, right: 20, bottom: 30, left: 40};
  width = +svg.attr('width') - margin.left - margin.right;
  height = +svg.attr('height') - margin.top - margin.bottom;
  height2 = +svg.attr('height') - margin2.top - margin2.bottom;

  x = d3.scaleLinear().range([0, width]);
  x2 = d3.scaleLinear().range([0, width]);
  y = d3.scaleLinear().range([height, 0]);
  y2 = d3.scaleLinear().range([height2, 0]);

  x.domain(d3.extent(data, function (d) {
    return d.time;
  }));
  y.domain([-300, 300]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  const xAxis = d3.axisBottom(x);
  const xAxis2 = d3.axisBottom(x2);
  const yAxis = d3.axisLeft(y);

  line = d3.line()
      .x(function (d) {
        return x(d.time);
      })
      .y(function (d) {
        return y(d.value);
      });

  line2 = d3.line()
      .x(function (d) {
        return x2(d.time);
      })
      .y(function (d) {
        return y2(d.value);
      });

  clip = svg.append('defs').append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);

  lineChart = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('clip-path', 'url(#clip)');

  const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

  context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

  context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2);



  zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', zoomed);

  const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on('brush end', brushed);

  context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range())
      .call(brush.move, x2.range());

  const overlay = svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('cursor', 'move')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
      return;
    } // ignore brush-by-zoom
    const s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    lineChart.selectAll('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
      return;
    } // ignore zoom-by-brush
    const t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    lineChart.selectAll('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
  }


  overlay.call(hover);

  function hover() {

    const bisect = d3.bisector(d => parseInt(d)).left;

    const scanner = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    scanner.append('line')
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .attr('y1', 0)
        .attr('y2', -height + margin.top);

    const tooltip = scanner
        .append("g")
        .attr("class", "tooltip-wrapper")
        .attr("display", "none");

    const tooltipBackground = tooltip.append("rect").attr("fill", "#e8e8e8");

    const tooltipText = tooltip.append("text");


    overlay
        .on('mouseover', () => scanner.style('display', null))
        .on('mousemove', mousemove);

    function mousemove() {
      tooltip.attr("display", null);
      const x0 = x.invert(d3.mouse(this)[0]);

      const xData = Object.keys(groupValuesByX);
      const i = bisect(xData, x0, 1),
          d0 = xData[i - 1],
          d1 = xData[i],
          d = x0 - d0 > d1 - x0 ? d1 : d0;
      scanner.select('line')
          .attr('transform',
              'translate(' + x(d) + ',' + height + ')');

      tooltipText.selectAll(".tooltip-text-line").remove();
      scanner.selectAll(".tooltip-line-circles").remove();
      tooltipText
          .append("tspan")
          .attr("class", "tooltip-text-line")
          .attr("x", "5")
          .attr("y", "5")
          .attr("dy", "13px")
          .attr("font-weight", "bold")
          .text(`${d}`);

      for (let key of Object.keys(groupValuesByX[d])) {

        tooltipText
            .append("tspan")
            .attr("class", "tooltip-text-line")
            .attr("x", "5")
            .attr("dy", `14px`)
            .attr("fill", color(key))
            .text(`Trace ${key}: ${groupValuesByX[d][key]}`);
      }

      tooltip.attr('transform',
               'translate(' + (x(d)+20) + ',' + '0' + ')')

      const tooltipWidth = tooltipText.node().getBBox().width;
      const tooltipHeight = tooltipText.node().getBBox().height;
      tooltipBackground.attr("width", tooltipWidth + 10).attr("height", tooltipHeight + 10);

    }

  }


}

function addLine(data, traceIndex) {
  data.forEach(point => {
    if(!groupValuesByX.hasOwnProperty(point.time)) {
      groupValuesByX[point.time] = {}
    }
    groupValuesByX[point.time][traceIndex] = point.value;
  });

  const svg = d3.select('#overlapped-chart');

  const lineColor = color(traceIndex);

  lineChart.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', () => lineColor)
      .attr('stroke-width', 1.5)
      .attr('d', line);

  context.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', () => lineColor)
      .attr('stroke-width', 1.5)
      .attr('d', line2);

}
