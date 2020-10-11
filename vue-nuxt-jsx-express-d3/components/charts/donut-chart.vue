<script>
// imports
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'DonutChart',
  props: ['data'],
  computed: {
    height() {
      return 500;
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
        // ...

        // axis
        // ...

        // geometry
        const arc = (() => {
          const radius = Math.min(width, height) / 2;
          return d3
            .arc()
            .innerRadius(radius * 0.67)
            .outerRadius(radius - 1);
        })();
        const pie = d3
          .pie()
          .padAngle(0.005)
          .sort(null)
          .value((d) => d.value);
        const color = d3
          .scaleOrdinal()
          .domain(data.map((d) => d.name))
          .range(d3.quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        // ------------
        // create d3 container
        // ------------

        const arcs = pie(data);

        const svg = d3
          .select(this.$refs.d3Container)
          .attr('viewBox', [-width / 2, -height / 2, width, height]);

        svg
          .selectAll('path')
          .data(arcs)
          .join('path')
          .attr('fill', (d) => color(d.data.name))
          .attr('d', arc)
          .append('title')
          .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

        svg
          .append('g')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 12)
          .attr('text-anchor', 'middle')
          .selectAll('text')
          .data(arcs)
          .join('text')
          .attr('transform', (d) => `translate(${arc.centroid(d)})`)
          .call((text) =>
            text
              .append('tspan')
              .attr('y', '-0.4em')
              .attr('font-weight', 'bold')
              .text((d) => d.data.name),
          )
          .call((text) =>
            text
              .filter((d) => d.endAngle - d.startAngle > 0.25)
              .append('tspan')
              .attr('x', 0)
              .attr('y', '0.7em')
              .attr('fill-opacity', 0.7)
              .text((d) => d.data.value.toLocaleString()),
          );
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
