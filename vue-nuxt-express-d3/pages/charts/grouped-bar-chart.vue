<script>
// imports
import GroupedBarChart from '../../components/charts/grouped-bar-chart'
import * as d3 from 'd3'

// component
export default {
  components: { GroupedBarChart },
  // state
  data() {
    return {
      data: null,
    }
  },
  // nuxt lifecycle method (for fetching)
  async mounted() {
    const csvStaticFilePath = '/data/grouped-bar-chart-data.csv'
    const csvFile = await fetch(csvStaticFilePath) // csv with 2 columns
    const csvText = await csvFile.text() // csv as string
    const csvData = d3.csvParse(
      csvText, // csv string to parse
      d3.autoType // callback
    )
    const sortedCsvData = csvData.sort(
      (a, b) => b['<10'] / b.total - a['<10'] / a.total
    )
    this.data = sortedCsvData
    // return { data: sortedCsvData }
  },
  render(h) {
    return (
      <div>
        <GroupedBarChart data={this.data} />
      </div>
    )
  },
}
</script>
