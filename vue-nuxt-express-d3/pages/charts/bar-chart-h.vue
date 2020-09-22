<script>
// imports
import BarChartH from '../../components/charts/bar-chart-h'
import * as d3 from 'd3'

// component
export default {
  components: { BarChartH },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/alphabet.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      ({ letter, frequency }) => ({ name: letter, value: +frequency })
    )
    const sortedCsvData = csvData.sort((a, b) =>
      d3.descending(a.value, b.value)
    )
    this.data = sortedCsvData
  },
  render(h) {
    return (
      <div>
        <BarChartH data={this.data} />
      </div>
    )
  },
}
</script>

<style></style>
