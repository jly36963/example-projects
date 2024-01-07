<script>
  
	let routes = [
  { endpoint: '/charts/bar-chart', text: 'bar chart' },
  { endpoint: '/charts/bar-chart-h', text: 'bar chart (h)' },
  { endpoint: '/charts/stacked-bar-chart', text: 'stacked bar chart' },
  { endpoint: '/charts/norm-stack-bar-chart', text: 'norm stack bar' },
  { endpoint: '/charts/grouped-bar-chart', text: 'grouped bar chart' },
  { endpoint: '/charts/hist-kde-chart', text: 'hist kde' },

  { endpoint: '/charts/area-chart', text: 'area chart' },
  { endpoint: '/charts/stacked-area-chart', text: 'stacked area chart' },
  { endpoint: '/charts/line-chart', text: 'line chart' },
  { endpoint: '/charts/multi-line-chart', text: 'multi line' },

  { endpoint: '/charts/donut-chart', text: 'donut chart' },
  { endpoint: '/charts/pie-chart', text: 'pie chart' },
  
  { endpoint: '/charts/box-plot', text: 'box plot' },
  { endpoint: '/charts/violin-chart', text: 'violin chart' },
  { endpoint: '/charts/scatter-plot', text: 'scatter plot' },
  { endpoint: '/charts/joint-hex-plot', text: 'joint hex' },
]

</script>

<svelte:head>
	<title>Svelte-D3</title>
</svelte:head>

<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 w-full text-center border rounded m-auto space-y-2 space-x-2">
		<h1 class="text-4xl leading-loose">
			Example Charts and Plots
	  </h1>
		{#each routes as route}
      <button class="inline-block border py-1 px-3 rounded">
        <a href={route.endpoint} class="text-xl">
          {route.text}
        </a>
      </button>
    {/each}
	</div>
</div>
