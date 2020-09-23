<script>
// imports
import PaddedPaper from '../components/padded-paper';
import FlexContainer from '../components/flex-container';
import { VBtn } from 'vuetify/lib';

// component
export default {
  components: { PaddedPaper, FlexContainer, VBtn },
  head() {
    return {
      title: 'D3 -- Index',
    };
  },
  data: function () {
    return {
      routes: [
        // bar
        { url: '/charts/bar-chart', text: 'bar chart' },
        { url: '/charts/bar-chart-h', text: 'bar chart (h)' },
        { url: '/charts/stacked-bar-chart', text: 'stacked bar chart' },
        { url: '/charts/norm-stack-bar-chart', text: 'norm stack bar chart' },
        { url: '/charts/grouped-bar-chart', text: 'grouped bar chart' },
        { url: '/charts/hist-kde-chart', text: 'hist kde chart' },
        // line & area
        { url: '/charts/area-chart', text: 'area chart' },
        { url: '/charts/stacked-area-chart', text: 'stacked area chart' },
        { url: '/charts/line-chart', text: 'line chart' },
        // round
        { url: '/charts/donut-chart', text: 'donut chart' },
        { url: '/charts/pie-chart', text: 'pie chart' },
        // box, violin, scatter, hex
        { url: '/charts/box-plot', text: 'box plot' },
        { url: '/charts/violin-chart', text: 'violin chart' },
        { url: '/charts/scatter-plot', text: 'scatter plot' },
      ],
    };
  },
  render: function (h) {
    return (
      <FlexContainer>
        <PaddedPaper>
          {this.routes.map((route, index) => (
            <span key={index} class="index-button">
              <NuxtLink to={route.url}>
                <VBtn color="#7B1FA2" dark={true} ripple={true} elevation={20}>
                  {route.text}
                </VBtn>
              </NuxtLink>
            </span>
          ))}
        </PaddedPaper>
      </FlexContainer>
    );
  },
};
</script>

<style>
.index-button {
  @apply inline-block m-2;
}
</style>
