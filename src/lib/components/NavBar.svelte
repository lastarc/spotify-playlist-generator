<script lang="ts">
	import type { UserProfile } from '$lib/spotify';

	interface Props {
		user?: UserProfile;
	}

	let { user }: Props = $props();
	let menuOpen = $state(false);
</script>

<nav class="bg-blue-600 py-4 text-white">
	<div class="container mx-auto flex max-w-screen-xl items-center justify-between px-4">
		<a href="/" class="text-xl font-medium hover:no-underline">Spotify Playlist Generator</a>

		{#if user}
			<div class="relative">
				<button class="cursor-pointer border-none bg-transparent p-0" onclick={() => (menuOpen = !menuOpen)}>
					<img
						src={user.images.length > 0 ? user.images[0].url : ''}
						alt={user.display_name || user.email || user.id}
						class="h-10 w-10 rounded-full"
					/>
				</button>
				{#if menuOpen}
					<div
						class="absolute right-0 top-full mt-2 min-w-[120px] rounded bg-white shadow-lg"
					>
						<a
							href="/api/logout"
							class="block px-4 py-3 text-gray-800 no-underline hover:bg-gray-100"
						>
							Logout
						</a>
					</div>
				{/if}
			</div>
		{:else}
			<a
				href="/api/login"
				class="rounded border border-white px-4 py-2 text-white no-underline hover:bg-white/10"
			>
				Login
			</a>
		{/if}
	</div>
</nav>
