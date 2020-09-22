<script>
// imports
import LineChart from '../../components/charts/line-chart'
import * as d3 from 'd3'

// component
export default {
  components: { LineChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/aapl.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      d3.autoType // callback
    )
    const mappedCsvData = csvData.map(({ date, close }) => ({
      date,
      value: close,
    }))
    this.data = mappedCsvData
  },
  render(h) {
    return (
      <div>
        <LineChart data={this.data} />
      </div>
    )
  },
}
</script>
