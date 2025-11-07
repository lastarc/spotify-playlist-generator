<script lang="ts">
	import NavBar from '$lib/components/NavBar.svelte';
	import '../app.css';

	let { data, children } = $props();
</script>

<svelte:head>
	<title>Spotify Playlist Generator</title>
	<meta name="description" content="Generate Spotify playlist based of on a list of song names" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<NavBar user={data.user} />

	<main class="flex flex-1 items-center justify-center">
		{@render children()}
	</main>

	<footer class="flex flex-1 items-center justify-center border-t border-gray-200 py-4">
		<a
			href="https://github.com/lastarc"
			target="_blank"
			rel="noopener noreferrer"
			class="flex flex-grow items-center justify-center hover:underline"
		>
			Developed by Arc
		</a>
	</footer>
</div>
