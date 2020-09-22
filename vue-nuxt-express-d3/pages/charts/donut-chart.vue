<script>
// imports
import DonutChart from '../../components/charts/donut-chart'
import * as d3 from 'd3'

// component
export default {
  components: { DonutChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/population-by-age.csv'
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
        <DonutChart data={this.data} />
      </div>
    )
  },
}
</script>

<style></style>
