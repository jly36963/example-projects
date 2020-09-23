<script>
// imports
import GroupedBarChart from '../../components/charts/grouped-bar-chart';
import * as d3 from 'd3';

// component
export default {
  components: { GroupedBarChart },
  head() {
    return {
      title: 'D3 -- Grouped Bar Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/grouped-bar-chart-data.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, d3.autoType);
    const sortedCsvData = csvData.sort((a, b) => b['<10'] / b.total - a['<10'] / a.total);
    this.data = sortedCsvData;
  },
  render(h) {
    return (
      <div>
        <GroupedBarChart data={this.data} />
      </div>
    );
  },
};
</script>
