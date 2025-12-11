<script>
// imports
import BarChart from '../../components/charts/bar-chart';
import * as d3 from 'd3';

// component
export default {
  components: { BarChart },
  head() {
    return {
      title: 'D3 -- Bar Chart',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/alphabet.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, ({ letter, frequency }) => ({
      name: letter,
      value: +frequency,
    }));
    const sortedCsvData = csvData.sort((a, b) => d3.descending(a.value, b.value));
    this.data = sortedCsvData;
  },
  render(h) {
    return (
      <div>
        <BarChart data={this.data} />
      </div>
    );
  },
};
</script>
