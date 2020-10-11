<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/us-population-state-age.csv';

  // helper methods
  const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
  const formatPercent = d3.format(".1%");

  // ref
  let d3Container;

  // state
  let data, margin, height, width;
 
  // onMount (lifecycle)
  onMount(async () => {

    // ------------
    // get data
    // ------------
    
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d)
      );
      const sortedCsvData = csvData.sort((a, b) => b["<10"] / b.total - a["<10"] / a.total)
      return sortedCsvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 30, right: 10, bottom: 0, left: 30 })
    height = data.length * 25 + margin.top + margin.bottom;
    width = 0.8 * height;
  });

  // reactive statement
  $: if (data && data.length && d3Container) {

    // series
    const series = d3.stack()
      .keys(data.columns.slice(1))
      .offset(d3.stackOffsetExpand)(data)
      .map(d => (d.forEach(v => v.key = d.key), d))
    // color
    const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc")

    // ------------
    // calculate axes
    // ------------

    // scale
    const x = d3.scaleLinear()
      .range([margin.left, width - margin.right])
    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.08)
    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 100, "%"))
      .call(g => g.selectAll(".domain").remove())
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove())

    // geometry
    // ... 

    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible");

    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d[0]))
      .attr("y", (d, i) => y(d.data.name))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth())
      .append("title")
      .text(d => `${d.data.name} ${d.key} ${formatPercent(d[1] - d[0])} (${formatValue(d.data[d.key])})`);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Norm Stacked Bar Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>