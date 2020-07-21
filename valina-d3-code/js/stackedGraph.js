const dispatch = d3.dispatch('bulkMouseMove', 'bulkZoom', 'bulkBrush');

async function drawStackedGraph(data, traceIndex) {
  const svg = d3.select(`#data-vis-result`).append('svg');

  svg.attr('width', 960).attr('height', 500);
  const margin = {top: 20, right: 20, bottom: 110, left: 40},
      margin2 = {top: 430, right: 20, bottom: 30, left: 40},
      width = +svg.attr('width') - margin.left - margin.right,
      height = +svg.attr('height') - margin.top - margin.bottom,
      height2 = +svg.attr('height') - margin2.top - margin2.bottom;

  svg.append('text')
      .attr('x', (width - 30))
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('text-decoration', 'underline')
      .text(`Trace ${traceIndex}`);

  const x = d3.scaleLinear().range([0, width]),
      x2 = d3.scaleLinear().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      y2 = d3.scaleLinear().range([height2, 0]);

  const xAxis = d3.axisBottom(x),
      xAxis2 = d3.axisBottom(x2),
      yAxis = d3.axisLeft(y);

  const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on('brush end', function customBrush() {
        dispatch.call('bulkBrush', this);
      });

  const zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [width, height]])
      .extent([[0, 0], [width, height]])
      .on('zoom', function customZoom() {
        dispatch.call('bulkZoom', this);
      });

  const line = d3.line()
      .x(function (d) {
        return x(d.time);
      })
      .y(function (d) {
        return y(d.value);
      });

  const line2 = d3.line()
      .x(function (d) {
        return x2(d.time);
      })
      .y(function (d) {
        return y2(d.value);
      });

  const clip = svg.append('defs').append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0);

  const line_chart = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('clip-path', 'url(#clip)');

  const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

  x.domain(d3.extent(data, function (d) {
    return d.time;
  }));
  y.domain([-300, 300]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

  line_chart.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

  context.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line2);

  context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height2 + ')')
      .call(xAxis2);

  context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range());

  // overlay
  const overlay = svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', width)
      .attr('height', height)
      .attr('cursor', 'move')
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

  overlay.call(hover);

  function hover() {

    const bisect = d3.bisector(d => d.time).left;

    const scanner = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    scanner.append('line')
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .attr('y1', 0)
        .attr('y2', -height + margin.top);

    scanner.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em');

    overlay
        .on('mouseover', () => scanner.style('display', null))
        .on('mousemove', function customMouseMove() {
          dispatch.call('bulkMouseMove', this);
        });

    function mousemove() {
      const x0 = x.invert(d3.mouse(this)[0]);

      const i = bisect(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.time > d1.time - x0 ? d1 : d0;
      scanner.select('line')
          .attr('transform',
              'translate(' + x(d.time) + ',' + height + ')');

      scanner.select('text')
          .attr('transform',
              'translate(' + x(d.time) + ',' + '0' + ')')
          .text(`(${d.time}, ${d.value})`);
    }

    dispatch.on('bulkMouseMove.' + traceIndex, mousemove);
  }

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') {
      return;
    } // ignore brush-by-zoom
    const s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    line_chart.select('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    svg.select('.zoom').call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
  }

  dispatch.on('bulkBrush.' + traceIndex, brushed);

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
      return;
    } // ignore zoom-by-brush
    const t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    line_chart.select('.line').attr('d', line);
    focus.select('.axis--x').call(xAxis);
    context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
  }

  dispatch.on('bulkZoom.' + traceIndex, zoomed);

}