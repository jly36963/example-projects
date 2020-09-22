<script>
// imports
import * as d3 from 'd3'
import FlexContainer from '../flex-container'
import PaddedPaper from '../padded-paper'
// component
export default {
  name: 'BarChart',
  props: ['data'],
  data() {
    return {
      // dimensions
      margin: { top: 30, right: 0, bottom: 30, left: 40 },
      height: 500,
      width: 700,
      // color
      color: 'steelblue',
    }
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        const { data, margin, height, width, color } = this
        // ------------
        // calculate axes
        // ------------

        // scale
        const x = d3
          .scaleBand()
          .domain(d3.range(data.length))
          .range([margin.left, width - margin.right])
          .padding(0.1)
        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .nice()
          .range([height - margin.bottom, margin.top])
        // axis
        const xAxis = (g) =>
          g.attr('transform', `translate(0,${height - margin.bottom})`).call(
            d3
              .axisBottom(x)
              .tickFormat((i) => data[i].name)
              .tickSizeOuter(0)
          )
        const yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, '%'))
            .call((g) => g.select('.domain').remove())
            .call((g) =>
              g
                .append('text')
                .attr('x', -margin.left)
                .attr('y', 10)
                .attr('fill', 'currentColor')
                .attr('text-anchor', 'start')
                .text('↑ Frequency')
            )

        // geometry
        // ...

        // ------------
        // create d3 container
        // ------------

        const svg = d3
          .select(this.$refs.d3Container)
          .attr('viewBox', [0, 0, width, height])

        svg
          .append('g')
          .attr('fill', color)
          .selectAll('rect')
          .data(data)
          .join('rect')
          .attr('x', (d, i) => x(i))
          .attr('y', (d) => y(d.value))
          .attr('height', (d) => y(0) - y(d.value))
          .attr('width', x.bandwidth())

        svg.append('g').call(xAxis)

        svg.append('g').call(yAxis)
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
    )
  },
}
</script>

<style></style>
