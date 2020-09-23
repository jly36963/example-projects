<script>
// imports
import LineChart from '../../components/charts/line-chart';
import * as d3 from 'd3';

// component
export default {
  components: { LineChart },
  head() {
    return {
      title: 'D3 -- Line Chart',
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
        <LineChart data={this.data} />
      </div>
    );
  },
};
</script>
