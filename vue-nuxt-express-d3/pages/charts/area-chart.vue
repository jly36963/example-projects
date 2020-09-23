<script>
// imports
import AreaChart from '../../components/charts/area-chart';
import * as d3 from 'd3';

// component
export default {
  components: { AreaChart },
  head() {
    return {
      title: 'D3 -- Area Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/aapl.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, d3.autoType);
    const mappedCsvData = csvData.map(({ date, close }) => ({
      date,
      value: close,
    }));
    this.data = mappedCsvData;
  },
  render(h) {
    return (
      <div>
        <AreaChart data={this.data} />
      </div>
    );
  },
};
</script>
