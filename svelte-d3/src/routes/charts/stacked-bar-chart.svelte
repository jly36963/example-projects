<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/us-population-state-age.csv';

  // helper method
  const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

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
      const sortedCsvData = csvData.sort((a, b) => b.total - a.total)
      return sortedCsvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 10, right: 10, bottom: 20, left: 40 })
    height = 500;
    width = 1.8* height;
  });

  $: if (data && data.length && d3Container) {

    // series
    const series = d3.stack()
      .keys(data.columns.slice(1))(data)
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
    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1)
    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .rangeRound([height - margin.bottom, margin.top])
    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove())
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.selectAll(".domain").remove())

    // geometry
    // ... 

    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => x(d.data.name))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .append("title")
      .text(d => `${d.data.name} ${d.key} ${formatValue(d.data[d.key])}`);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Stacked Bar Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>