<script>
// imports
import StackedAreaChart from '../../components/charts/stacked-area-chart'
import * as d3 from 'd3'

// component
export default {
  components: { StackedAreaChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/unemployment-2.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      (d, i, columns) => (
        d3.autoType(d), (d.total = d3.sum(columns, (c) => d[c])), d
      )
    )
    const sortedCsvData = csvData.sort((a, b) => b.total - a.total)
    this.data = sortedCsvData
  },
  render(h) {
    return (
      <div>
        <StackedAreaChart data={this.data} />
      </div>
    )
  },
}
</script>

<style></style>
