<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/alphabet.csv';

  // ref
  let d3Container;

  // state
  let data, height, width, barHeight, margin;

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
    barHeight = 25;
    margin = ({ top: 30, right: 0, bottom: 30, left: 30 })
    height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom
    width = height;
  });

  $: if (data && data.length && d3Container) {

    // ------------
    // calculate axes
    // ------------

    // scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([margin.left, width - margin.right])
    const y = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.1)
    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80, "%"))
      .call(g => g.select(".domain").remove())
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSizeOuter(0))

    // geometry
    const format = x.tickFormat(20, "%")

    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d, i) => y(i))
      .attr("width", d => x(d.value) - x(0))
      .attr("height", y.bandwidth());

    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", d => x(d.value) - 4)
      .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => format(d.value));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Horizontal Bar Chart</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>