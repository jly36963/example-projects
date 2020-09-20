<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/alphabet.csv';

  // ref
  let d3Container;

  // state
  let data, margin, height, width, color;
  
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
        ({letter, frequency}) => ({name: letter, value: +frequency})
      );
      const sortedCsvData = csvData.sort((a, b) => d3.descending(a.value, b.value)) // , {format: "%", y: "↑ Frequency"})
      return sortedCsvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 30, right: 0, bottom: 30, left: 40 })
    height = 500;
    width = 1.4 * height;
    color = "steelblue"
  });

  // reactive statements
  $: if (data && data.length && d3Container) {

    // ------------
    // calculate axes
    // ------------

    // scale
    const x = d3.scaleBand()
      .domain(d3.range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1)
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "%"))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Frequency"))

    // geometry
    // ... 

    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
      .attr("fill", color)
      .selectAll("rect")
      .data(data)
      .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth());

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Bar Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>