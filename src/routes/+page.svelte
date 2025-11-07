<script lang="ts">
	import Button from '@smui/button';
	import Generator from '$lib/components/Generator.svelte';

	let { data } = $props();
</script>

{#if data.user}
	<Generator user={data.user} />
{:else}
	<div class="welcome">
		<h1>Welcome to Spotify Playlist Generator</h1>
		<p>Please log in to create playlists from your song names.</p>
		<Button
			variant="raised"
			href="/api/login"
			style="background-color: #1db954; color: white; padding: 12px 32px; border-radius: 24px; font-weight: 600;"
		>
			Login with Spotify
		</Button>
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
</style>
