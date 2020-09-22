<script>
// imports
import ScatterPlot from '../../components/charts/scatter-plot'
import * as d3 from 'd3'

// component
export default {
  components: { ScatterPlot },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/iris.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      d3.autoType // callback
    )
    this.data = csvData
  },
  render(h) {
    return (
      <div>
        <ScatterPlot data={this.data} />
      </div>
    )
  },
}
</script>
