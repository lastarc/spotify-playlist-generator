<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Spotify Playlist Generator</title>
	<meta name="description" content="Generate Spotify playlist based of on a list of song names" />
</svelte:head>

<div class="app">
	<NavBar user={data.user} />

	<main>
		{@render children()}
	</main>

	<footer>
		<a href="https://github.com/lastarc" target="_blank" rel="noopener noreferrer">
			Developed by Arc
		</a>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
			'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		min-height: 85vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	footer {
		display: flex;
		flex: 1;
		padding: 1rem 0;
		border-top: 1px solid #eaeaea;
		justify-content: center;
		align-items: center;
	}

	footer a {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		color: inherit;
		text-decoration: none;
	}

	footer a:hover {
		text-decoration: underline;
	}
</style>
