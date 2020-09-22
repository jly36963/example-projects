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
      margin: { top: 20, right: 20, bottom: 30, left: 40 },
      height: 600,
      width: 800,
    }
  },
  computed: {
    n() {
      return this.width / 40
    },
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        const { data, margin, height, width, n } = this
        // ------------
        // calculate axes
        // ------------

        // bins
        const bins = d3
          .histogram()
          .thresholds(n)
          .value((d) => d.x)(data)
          .map((bin) => {
            bin.sort((a, b) => a.y - b.y)
            const values = bin.map((d) => d.y)
            const min = values[0]
            const max = values[values.length - 1]
            const q1 = d3.quantile(values, 0.25)
            const q2 = d3.quantile(values, 0.5)
            const q3 = d3.quantile(values, 0.75)
            const iqr = q3 - q1 // interquartile range
            const r0 = Math.max(min, q1 - iqr * 1.5)
            const r1 = Math.min(max, q3 + iqr * 1.5)
            bin.quartiles = [q1, q2, q3]
            bin.range = [r0, r1]
            bin.outliers = bin.filter((v) => v.y < r0 || v.y > r1) // TODO
            return bin
          })
        // scale
        const y = d3
          .scaleLinear()
          .domain([
            d3.min(bins, (d) => d.range[0]),
            d3.max(bins, (d) => d.range[1]),
          ])
          .nice()
          .range([height - margin.bottom, margin.top])
        const x = d3
          .scaleLinear()
          .domain([d3.min(bins, (d) => d.x0), d3.max(bins, (d) => d.x1)])
          .rangeRound([margin.left, width - margin.right])
        // axis
        const yAxis = (g) =>
          g
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, 's'))
            .call((g) => g.select('.domain').remove())
        const xAxis = (g) =>
          g
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(n).tickSizeOuter(0))

        // ------------
        // create d3 container
        // ------------

        // select (d3Container)
        const svg = d3.select(this.$refs.d3Container)
        // append children
        const g = svg.append('g').selectAll('g').data(bins).join('g')

        g.append('path')
          .attr('stroke', 'currentColor')
          .attr(
            'd',
            (d) => `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}
      `
          )

        g.append('path')
          .attr('fill', '#ddd')
          .attr(
            'd',
            (d) => `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z
      `
          )

        g.append('path')
          .attr('stroke', 'currentColor')
          .attr('stroke-width', 2)
          .attr(
            'd',
            (d) => `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}
      `
          )

        g.append('g')
          .attr('fill', 'currentColor')
          .attr('fill-opacity', 0.2)
          .attr('stroke', 'none')
          .attr('transform', (d) => `translate(${x((d.x0 + d.x1) / 2)},0)`)
          .selectAll('circle')
          .data((d) => d.outliers)
          .join('circle')
          .attr('r', 2)
          .attr('cx', () => (Math.random() - 0.5) * 4)
          .attr('cy', (d) => y(d.y))

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
