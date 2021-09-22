<script>
// imports
import BoxPlot from '../../components/charts/box-plot';
import * as d3 from 'd3';

// component
export default {
  components: { BoxPlot },
  head() {
    return {
      title: 'D3 -- Box PLot',
    };
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/diamonds.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, ({ carat, price }) => ({ x: +carat, y: +price }));
    this.data = csvData;
  },
  render(h) {
    return (
      <div>
        <BoxPlot data={this.data} />
      </div>
    );
  },
};
</script>
