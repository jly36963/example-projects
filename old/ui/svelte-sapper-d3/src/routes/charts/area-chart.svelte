<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/aapl.csv';

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
        d3.autoType // callback
      );
      const mappedCsvData = csvData
        .map(({ date, close }) => ({ date, value: close }))
      return mappedCsvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 20, right: 20, bottom: 30, left: 30 })
    height = 450;
    width = 1.4 * height;
  });

  // reactive statements
  $: if (data && data.length && d3Container) {

    // ------------
    // calculate axes
    // ------------

    // scale
    const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right])
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("$ Close"))

    // geometry
    const curve = d3.curveLinear;
    const area = d3.area()
      .curve(curve)
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))


    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("d", area);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Area Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>