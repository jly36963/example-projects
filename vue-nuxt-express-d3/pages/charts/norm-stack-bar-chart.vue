<script>
// imports
import NormStackBarChart from '../../components/charts/norm-stack-bar-chart';
import * as d3 from 'd3';

// component
export default {
  components: { NormStackBarChart },
  head() {
    return {
      title: 'D3 -- Norm Stack Bar Chart',
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
    console.log('TCL: mounted -> csvText', csvText);
    const csvData = d3.csvParse(
      csvText,
      (d, i, columns) => (d3.autoType(d), (d.total = d3.sum(columns, (c) => d[c])), d),
    );
    const sortedCsvData = csvData.sort((a, b) => b['<10'] / b.total - a['<10'] / a.total);
    this.data = sortedCsvData;
  },
  render(h) {
    return (
      <div>
        <NormStackBarChart data={this.data} />
      </div>
    );
  },
};
</script>
