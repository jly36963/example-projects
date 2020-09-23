<script>
// imports
import PieChart from '../../components/charts/pie-chart';
import * as d3 from 'd3';

// component
export default {
  components: { PieChart },
  head() {
    return {
      title: 'D3 -- Pie Chart',
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
        <PieChart data={this.data} />
      </div>
    );
  },
};
</script>
