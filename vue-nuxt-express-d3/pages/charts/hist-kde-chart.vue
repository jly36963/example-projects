<script>
// imports
import HistKDEChart from '../../components/charts/hist-kde-chart';
import * as d3 from 'd3';

// component
export default {
  components: { HistKDEChart },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    const jsonStaticFilePath = '/data/old-faithful.json';
    const jsonFile = await fetch(jsonStaticFilePath);
    const jsonData = await jsonFile.json();
    this.data = jsonData;
  },
  render(h) {
    return (
      <div>
        <HistKDEChart data={this.data} />
      </div>
    );
  },
};
</script>
