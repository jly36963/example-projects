<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  const csvStaticFilePath = '/data/diamonds.csv';

  // observable example (vanilla js)
  // https://observablehq.com/@d3/box-plot

  // ref
  let d3Container;

  // state
  let data, margin, height, width, n;

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
        ({ carat, price }) => ({ x: +carat, y: +price }) // callback
      );
      return csvData;
    }

    // set state
    data = await getData();

    // ------------
    // dimensions
    // ------------

    // set state (sometimes dependent on data)
    margin = ({ top: 20, right: 20, bottom: 30, left: 40 })
    height = 600
    width = 800;
    n = width / 40;
  });

  // reactive statement
  $: if (data && data.length && d3Container) {

    // ------------
    // calculate bins/axes
    // ------------

    // bins
    const bins = d3.histogram()
      .thresholds(n)
      .value(d => d.x)
      (data)
      .map(bin => {
        bin.sort((a, b) => a.y - b.y);
        const values = bin.map(d => d.y);
        const min = values[0];
        const max = values[values.length - 1];
        const q1 = d3.quantile(values, 0.25);
        const q2 = d3.quantile(values, 0.50);
        const q3 = d3.quantile(values, 0.75);
        const iqr = q3 - q1; // interquartile range
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        bin.quartiles = [q1, q2, q3];
        bin.range = [r0, r1];
        bin.outliers = bin.filter(v => v.y < r0 || v.y > r1); // TODO
        return bin;
      })
    // scale
    const y = d3.scaleLinear()
      .domain([d3.min(bins, d => d.range[0]), d3.max(bins, d => d.range[1])]).nice()
      .range([height - margin.bottom, margin.top])
    const x = d3.scaleLinear()
      .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
      .rangeRound([margin.left, width - margin.right])
    // axis
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.select(".domain").remove())
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(n).tickSizeOuter(0))

    // ------------
    // create d3 container
    // ------------

    // select (d3Container)
    const svg = d3.select(d3Container);
    // append children
    const g = svg.append("g")
      .selectAll("g")
      .data(bins)
      .join("g");

    g.append("path")
      .attr("stroke", "currentColor")
      .attr("d", d => `
      M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
      V${y(d.range[0])}
    `);

    g.append("path")
      .attr("fill", "#ddd")
      .attr("d", d => `
      M${x(d.x0) + 1},${y(d.quartiles[2])}
      H${x(d.x1)}
      V${y(d.quartiles[0])}
      H${x(d.x0) + 1}
      Z
    `);

    g.append("path")
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2)
      .attr("d", d => `
      M${x(d.x0) + 1},${y(d.quartiles[1])}
      H${x(d.x1)}
    `);

    g.append("g")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "none")
      .attr("transform", d => `translate(${x((d.x0 + d.x1) / 2)},0)`)
      .selectAll("circle")
      .data(d => d.outliers)
      .join("circle")
      .attr("r", 2)
      .attr("cx", () => (Math.random() - 0.5) * 4)
      .attr("cy", d => y(d.y));

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);
  }

</script>

<svelte:head>
  <title>Svelte Box Plot</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 text-center text-lg border rounded m-auto">
    <svg class="d3-component" bind:this={d3Container} width={width} height={height} />
  </div>
</div>