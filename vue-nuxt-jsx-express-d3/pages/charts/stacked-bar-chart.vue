<script>
// imports
import StackedBarChart from '../../components/charts/stacked-bar-chart';
import * as d3 from 'd3';

// component
export default {
  components: { StackedBarChart },
  head() {
    return {
      title: 'D3 -- Stacked Bar Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/us-population-state-age.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(
      csvText,
      (d, i, columns) => (d3.autoType(d), (d.total = d3.sum(columns, (c) => d[c])), d),
    );
    const sortedCsvData = csvData.sort((a, b) => b.total - a.total);
    this.data = sortedCsvData;
  },
  render(h) {
    return (
      <div>
        <StackedBarChart data={this.data} />
      </div>
    );
  },
};
</script>
