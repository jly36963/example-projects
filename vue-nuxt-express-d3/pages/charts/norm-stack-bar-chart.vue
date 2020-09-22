<script>
// imports
import NormStackBarChart from '../../components/charts/norm-stack-bar-chart'
import * as d3 from 'd3'

// component
export default {
  components: { NormStackBarChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/us-population-state-age.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    console.log('TCL: mounted -> csvText', csvText)
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      (d, i, columns) => (
        d3.autoType(d), (d.total = d3.sum(columns, (c) => d[c])), d
      )
    )
    const sortedCsvData = csvData.sort(
      (a, b) => b['<10'] / b.total - a['<10'] / a.total
    )
    this.data = sortedCsvData
  },
  render(h) {
    return (
      <div>
        <NormStackBarChart data={this.data} />
      </div>
    )
  },
}
</script>

<style></style>
