<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const jsonDataStaticFilePath = '/data/old-faithful.json';

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
      const jsonFile = await fetch(jsonDataStaticFilePath);
      const jsonData = await jsonFile.json();
      return jsonData;
    }

    // set state
    data = await getData();   
    
    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 20, right: 20, bottom: 30, left: 30 })
    height = 500;
    width = 1.6 * height;
  });

  // reactive statement
  $: if (data && data.length && d3Container) {

    // ------------
    // calculate axes
    // ------------

    // helper functions
    // ...

    // scale
    const x = d3.scaleLinear()
      .domain(d3.extent(data)).nice()
      .range([margin.left, width - margin.right])
    const thresholds = x.ticks(40);
    const bins = d3.histogram()
      .domain(x.domain())
      .thresholds(thresholds)
      (data)
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) / data.length])
      .range([height - margin.bottom, margin.top])


    // axis
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(data.title))
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "%"))
      .call(g => g.select(".domain").remove())

    // geometry
    const kde = (kernel, thresholds, data) => {
      return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }
    const epanechnikov = (bandwidth) => {
      return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }
    const bandwidth = 6.0; // manually set
    const density = kde(epanechnikov(bandwidth), thresholds, data)
    const line = d3.line()
      .curve(d3.curveBasis)
      .x(d => x(d[0]))
      .y(d => y(d[1]))


    // ------------
    // create d3 container
    // ------------

    const svg = d3.select(d3Container)
      .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
      .attr("fill", "#bbb")
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", d => x(d.x0) + 1)
      .attr("y", d => y(d.length / data.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => y(0) - y(d.length / data.length));

    svg.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d", line);

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Histogram KDE</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>