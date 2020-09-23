<script>
// imports
import ViolinChart from '../../components/charts/violin-chart';
import * as d3 from 'd3';

// component
export default {
  components: { ViolinChart },
  head() {
    return {
      title: 'D3 -- Violin Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/iris-data.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, d3.autoType);
    this.data = csvData;
  },
  render(h) {
    return (
      <div>
        <ViolinChart data={this.data} />
      </div>
    );
  },
};
</script>
