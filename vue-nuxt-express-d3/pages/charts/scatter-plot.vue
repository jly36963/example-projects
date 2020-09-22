<script>
// imports
import ScatterPlot from '../../components/charts/scatter-plot';
import * as d3 from 'd3';

// component
export default {
  components: { ScatterPlot },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const csvStaticFilePath = '/data/iris.csv';
    const csvFile = await fetch(csvStaticFilePath);
    const csvText = await csvFile.text();
    const csvData = d3.csvParse(csvText, d3.autoType);
    this.data = csvData;
  },
  render(h) {
    return (
      <div>
        <ScatterPlot data={this.data} />
      </div>
    );
  },
};
</script>
