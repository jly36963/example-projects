<script>
// imports
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'StackedBarChart',
  props: ['data'],
  methods: {
    formatValue: (x) => (isNaN(x) ? 'N/A' : x.toLocaleString('en')),
  },
  data() {
    return {
      margin: { top: 30, right: 0, bottom: 20, left: 40 },
    };
  },
  computed: {
    height: function () {
      return 500;
    },
    width: function () {
      return this.height * 1.8;
    },
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        // ------------
        // calculate axes
        // ------------

        const { data, margin, height, width } = this;

        // series
        const series = d3
          .stack()
          .keys(data.columns.slice(1))(data)
          .map((d) => (d.forEach((v) => (v.key = d.key)), d));
        // color
        const color = d3
          .scaleOrdinal()
          .domain(series.map((d) => d.key))
          .range(d3.schemeSpectral[series.length])
          .unknown('#ccc');

        // ------------
        // calculate axes
        // ------------

        // scale
        const x = d3
          .scaleBand()
          .domain(data.map((d) => d.name))
          .range([margin.left, width - margin.right])
          .padding(0.1);
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
          .rangeRound([height - margin.bottom, margin.top]);
        // axis
        const xAxis = (g) =>
          g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call((g) => g.selectAll('.domain').remove());
        const yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, 's'))
            .call((g) => g.selectAll('.domain').remove());

        // geometry
        // ...

        // ------------
        // create d3 container
        // ------------

        const svg = d3.select(this.$refs.d3Container).attr('viewBox', [0, 0, width, height]);

        svg
          .append('g')
          .selectAll('g')
          .data(series)
          .join('g')
          .attr('fill', (d) => color(d.key))
          .selectAll('rect')
          .data((d) => d)
          .join('rect')
          .attr('x', (d, i) => x(d.data.name))
          .attr('y', (d) => y(d[1]))
          .attr('height', (d) => y(d[0]) - y(d[1]))
          .attr('width', x.bandwidth())
          .append('title')
          .text((d) => `${d.data.name} ${d.key} ${this.formatValue(d.data[d.key])}`);

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

<style></style>
