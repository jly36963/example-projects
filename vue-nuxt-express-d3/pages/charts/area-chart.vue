<script>
// imports
import AreaChart from '../../components/charts/area-chart'
import * as d3 from 'd3'

// component
export default {
  components: { AreaChart },
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
        <AreaChart data={this.data} />
      </div>
    )
  },
}
</script>

<style></style>
