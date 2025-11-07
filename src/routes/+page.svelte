<script lang="ts">
	import Generator from '$lib/components/Generator.svelte';

	let { data } = $props();
</script>

{#if data.user}
	<Generator user={data.user} />
{:else}
	<div class="welcome">
		<h1>Welcome to Spotify Playlist Generator</h1>
		<p>Please log in to create playlists from your song names.</p>
		<a href="/api/login" class="login-button">Login with Spotify</a>
	</div>
{/if}

<style>
	.welcome {
		text-align: center;
		padding: 2rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1rem;
		color: #333;
	}

	p {
		font-size: 1.125rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.login-button {
		display: inline-block;
		padding: 0.75rem 2rem;
		background-color: #1db954;
		color: white;
		text-decoration: none;
		border-radius: 2rem;
		font-weight: 600;
		font-size: 1rem;
		transition: background-color 0.2s;
	}

	.login-button:hover {
		background-color: #1ed760;
	}
</style>
