<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.css';

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
		padding: 1rem 0;
		border-top: 1px solid #eaeaea;
		justify-content: center;
		align-items: center;
	}

	footer a {
		display: flex;
		justify-content: center;
		align-items: center;
		color: inherit;
		text-decoration: none;
	}

	footer a:hover {
		text-decoration: underline;
	}
</style>
