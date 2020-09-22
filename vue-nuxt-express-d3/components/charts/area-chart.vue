<script>
// imports
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'AreaChart',
  props: ['data'],
  data() {
    return {
      // dimensions
      margin: { top: 20, right: 20, bottom: 30, left: 30 },
      height: 500,
      width: 700,
    };
  },
  computed: {
    height() {
      return 450;
    },
    width() {
      return 1.4 * this.height;
    },
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        const { data, margin, height, width } = this;
        // ------------
        // calculate axes
        // ------------

        // scale
        const x = d3
          .scaleUtc()
          .domain(d3.extent(data, (d) => d.date))
          .range([margin.left, width - margin.right]);
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .nice()
          .range([height - margin.bottom, margin.top]);
        // axis
        const xAxis = (g) =>
          g.attr('transform', `translate(0,${height - margin.bottom})`).call(
            d3
              .axisBottom(x)
              .ticks(width / 80)
              .tickSizeOuter(0),
          );
        const yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call((g) => g.select('.domain').remove())
            .call((g) =>
              g
                .select('.tick:last-of-type text')
                .clone()
                .attr('x', 3)
                .attr('text-anchor', 'start')
                .attr('font-weight', 'bold')
                .text('$ Close'),
            );

        // geometry
        const curve = d3.curveLinear;
        const area = d3
          .area()
          .curve(curve)
          .x((d) => x(d.date))
          .y0(y(0))
          .y1((d) => y(d.value));

        // ------------
        // create d3 container
        // ------------

        const svg = d3.select(this.$refs.d3Container).attr('viewBox', [0, 0, width, height]);

        svg
          .append('path')
          .datum(data)
          .attr('fill-opacity', '0.5')
          .attr('fill', 'steelblue')
          .attr('d', area);

        svg.append('g').call(xAxis);

        svg.append('g').call(yAxis);
      }
    },
  },
  render(h) {
    return (
      <FlexContainer>
        <PaddedPaper>
          <svg ref="d3Container" width={this.width} height={this.height} />
        </PaddedPaper>
      </FlexContainer>
    );
  },
};
</script>
