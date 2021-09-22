<script>
// imports
import DonutChart from '../../components/charts/donut-chart';
import * as d3 from 'd3';

// component
export default {
  components: { DonutChart },
  head() {
    return {
      title: 'D3 -- Donut Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/population-by-age.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, d3.autoType);
    this.data = csvData;
  },
  render(h) {
    return (
      <div>
        <DonutChart data={this.data} />
      </div>
    );
  },
};
</script>
