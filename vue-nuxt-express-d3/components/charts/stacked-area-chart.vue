<script>
// imports
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'BarChart',
  props: ['data'],
  data() {
    return {
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
    };
  },
  computed: {
    height() {
      return 500;
    },
    width() {
      return 1.8 * this.height;
    },
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        const { data, margin, height, width } = this;
        // series
        const series = d3.stack().keys(data.columns.slice(1))(data);
        // color
        const color = d3.scaleOrdinal().domain(data.columns.slice(1)).range(d3.schemeCategory10);

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
          .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
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
                .text('Unemployment'),
            );

        // geometry
        const area = d3
          .area()
          .x((d) => x(d.data.date))
          .y0((d) => y(d[0]))
          .y1((d) => y(d[1]));

        // ------------
        // create d3 container
        // ------------

        const svg = d3.select(this.$refs.d3Container).attr('viewBox', [0, 0, width, height]);

        svg
          .append('g')
          .selectAll('path')
          .data(series)
          .join('path')
          .attr('fill', ({ key }) => color(key))
          .attr('d', area)
          .append('title')
          .text(({ key }) => key);

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
