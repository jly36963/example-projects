<script>
// imports
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection'; // nest removed from d3 in v6
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';
// component
export default {
  name: 'ViolinChart',
  props: ['data'],
  data() {
    return {
      margin: { top: 10, right: 30, bottom: 30, left: 40 },
    };
  },
  computed: {
    height() {
      return 400 - this.margin.top - this.margin.bottom;
    },
    width() {
      return 600 - this.margin.left - this.margin.right;
    },
  },
  watch: {
    data: function (newData, oldData) {
      if (this.data.length) {
        const { data, margin, height, width, color } = this;
        // ------------
        // calculate axes
        // ------------

        // scale
        const y = d3
          .scaleLinear()
          .domain([3.5, 8]) // Note that here the Y scale is set manually
          .range([height, 0]);

        const x = d3
          .scaleBand()
          .range([0, width])
          .domain(['setosa', 'versicolor', 'virginica'])
          .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

        // axis
        // ...

        // geometry

        const histogram = d3
          .histogram()
          .domain(y.domain())
          .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
          .value((d) => d);

        // Compute the binning for each group of the dataset
        const sumstat = d3Collection
          .nest() // nest function allows to group the calculation per level of a factor
          .key((d) => d.Species)
          .rollup((d) => {
            // For each key..
            const input = d.map((g) => g.Sepal_Length); // Keep the variable called Sepal_Length
            const bins = histogram(input); // And compute the binning on it.
            return bins;
          })
          .entries(data);

        // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
        let maxNum = 0;
        for (const i in sumstat) {
          const allBins = sumstat[i].value;
          const lengths = allBins.map(function (a) {
            return a.length;
          });
          const longest = d3.max(lengths);
          if (longest > maxNum) {
            maxNum = longest;
          }
        }

        // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
        const xNum = d3.scaleLinear().range([0, x.bandwidth()]).domain([-maxNum, maxNum]);

        // ------------
        // create d3 container
        // ------------

        const svg = d3
          .select(this.$refs.d3Container)
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.append('g').call(d3.axisLeft(y));

        svg
          .append('g')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x));

        svg
          .selectAll('myViolin')
          .data(sumstat)
          .enter() // So now we are working group per group
          .append('g')
          .attr('transform', function (d) {
            return 'translate(' + x(d.key) + ' ,0)';
          }) // Translation on the right to be at the group position
          .append('path')
          .datum(function (d) {
            return d.value;
          }) // So now we are working bin per bin
          .style('stroke', 'none')
          .style('fill', '#69b3a2')
          .attr(
            'd',
            d3
              .area()
              .x0(function (d) {
                return xNum(-d.length);
              })
              .x1(function (d) {
                return xNum(d.length);
              })
              .y(function (d) {
                return y(d.x0);
              })
              .curve(d3.curveCatmullRom), // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
          );
      }
    },
  },
  render(h) {
    return (
      <FlexContainer>
        <PaddedPaper>
          <svg ref="d3Container" width={this.width} height={this.height} />
        </PaddedPaper>
      </FlexContainer>
    );
  },
};
</script>

<style></style>
