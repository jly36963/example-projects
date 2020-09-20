<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/population-by-age.csv';

  // ref
  let d3Container;

  // state
  let data, height, width;

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
        d3.autoType
      );
      return csvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    height = 500;
    width = 1.4 * height;
  });

  // reactive statement
  $: if (data && data.length && d3Container) {

    // ------------
    // calculate axes
    // ------------

    // scale
    // ...

    // axis
    // ...

    // geometry
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1)
    const arcLabel = (() => {
      const radius = Math.min(width, height) / 2 * 0.8;
      return d3.arc().innerRadius(radius).outerRadius(radius);
    })()
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value)
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    // ------------
    // create d3 container
    // ------------

    const arcs = pie(data);
    
    const svg = d3.select(d3Container)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString()));
  }

</script>

<svelte:head>
  <title>Svelte Pie Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>