<script lang="ts">
	import Generator from '$lib/components/Generator.svelte';

	let { data } = $props();
</script>

{#if data.user}
	<Generator user={data.user} />
{:else}
	<div class="p-8 text-center">
		<h1 class="mb-4 text-3xl font-bold text-gray-800">Welcome to Spotify Playlist Generator</h1>
		<p class="mb-8 text-lg text-gray-600">Please log in to create playlists from your song names.</p>
		<a
			href="/api/login"
			class="inline-block rounded-full bg-green-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-600"
		>
			Login with Spotify
		</a>
	</div>
{/if}
