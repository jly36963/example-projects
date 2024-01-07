<script>
// imports
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'LineChart',
  props: ['data'],
  data() {
    return {
      margin: { top: 20, right: 20, bottom: 30, left: 30 },
    };
  },
  computed: {
    height() {
      return 450;
    },
    width() {
      return this.height * 1.4;
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
        const line = d3
          .line()
          .defined((d) => !isNaN(d.value))
          .x((d) => x(d.date))
          .y((d) => y(d.value));

        // ------------
        // create d3 container
        // ------------

        const svg = d3.select(this.$refs.d3Container).attr('viewBox', [0, 0, width, height]);

        svg.append('g').call(xAxis);

        svg.append('g').call(yAxis);

        svg
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('d', line);
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

<style></style>
