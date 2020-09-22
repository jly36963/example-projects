<script>
// imports
import ViolinChart from '../../components/charts/violin-chart'
import * as d3 from 'd3'

// component
export default {
  components: { ViolinChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/iris-data.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      d3.autoType
    )
    this.data = csvData
  },
  render(h) {
    return (
      <div>
        <ViolinChart data={this.data} />
      </div>
    )
  },
}
</script>
