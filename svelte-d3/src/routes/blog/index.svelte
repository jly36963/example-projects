<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`blog.json`).then(r => r.json()).then(posts => {
			return { posts };
		});
	}
</script>

<script>
	export let posts;
</script>

<style>
	ul {
		margin: 0 0 1em 0;
		line-height: 1.5;
	}
</style>

<svelte:head>
	<title>Blog</title>
</svelte:head>


<div class="container h-screen w-full flex flex-row justify-center content-center">
	<div class="p-4 w-full text-center text-lg border rounded m-auto space-y-2">
		<h1 class="text-4xl mb-4">Recent posts</h1>
		<ul class="space-y-2">
			{#each posts as post}
			<li><a rel='prefetch' href='blog/{post.slug}'>{post.title}</a></li>
			<!-- 
				we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event 
			-->
			{/each}
		</ul>
	</div>
</div>

