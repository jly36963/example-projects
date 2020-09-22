<script>
// imports
import BoxPlot from '../../components/charts/box-plot'
import * as d3 from 'd3'

// component
export default {
  components: { BoxPlot },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/diamonds.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      ({ carat, price }) => ({ x: +carat, y: +price }) // callback
    )
    this.data = csvData
  },
  render(h) {
    return (
      <div>
        <BoxPlot data={this.data} />
      </div>
    )
  },
}
</script>
