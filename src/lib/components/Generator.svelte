<script lang="ts">
	import type { UserProfile } from '$lib/spotify';

	interface Props {
		user: UserProfile;
	}

	interface Track {
		id: string;
		name: string;
		uri: string;
		external_urls: { spotify: string };
		album: { images: { url: string }[] };
		artists: { name: string }[];
	}

	let { user }: Props = $props();

	let loading = $state(false);
	let trackNames = $state('');
	let commonKeyword = $state('');
	let playlistName = $state('');
	let tracks = $state<(Track | null)[]>([]);
	let alertMessage = $state<{ url: string; name: string } | null>(null);

	function removeClutter() {
		trackNames = trackNames
			.replace(/\r/g, '')
			.split('\n')
			.map((i) =>
				i
					.replace(/feat\.\s|Official\s+Audio|\sAudio\s/gi, '')
					.replace(/([0-9]|:|\.|\[|\])+/g, '')
					.replace(/-/g, '')
					.replace(/\s+/g, ' ')
					.trim()
			)
			.join('\n');
	}

	function reset() {
		trackNames = '';
		commonKeyword = '';
		tracks = [];
		playlistName = '';
		alertMessage = null;
	}

	async function findTracks() {
		loading = true;

		const titles = trackNames
			.replace(/\r/g, '')
			.split('\n')
			.map((i) => i.trim())
			.filter((i) => i !== '');
		const keyword = commonKeyword.trim();

		const results = await Promise.all(
			titles.map((i) =>
				fetch(
					'/api/search?q=' +
						encodeURIComponent(i) +
						(keyword ? '+' + encodeURIComponent(keyword) : '')
				).then((r) => r.json())
			)
		);

		tracks = results.map((i) => (i.items?.length > 0 ? i.items[0] : null));

		loading = false;
	}

	async function createPlaylist() {
		if (tracks.length < 1) return;

		const uris = tracks
			.filter((i) => i !== null)
			.map((i) => i!.uri)
			.join(',');

		const res = await fetch('/api/playlist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: playlistName,
				tracks: uris
			})
		});
		const json = await res.json();

		console.log(json);

		alertMessage = {
			url: json.external_urls.spotify,
			name: json.name
		};
	}
</script>

<div class="mx-auto my-5 w-[90vw] max-w-[min(90vw,450px)]">
	<div class="mb-2 flex justify-end">
		<button
			class="cursor-pointer border-none bg-transparent px-3 py-1 text-sm uppercase text-blue-600 hover:bg-blue-600/5 disabled:cursor-not-allowed disabled:opacity-60"
			disabled={loading}
			onclick={removeClutter}
		>
			Remove clutter
		</button>
	</div>

	<div class="mb-6 flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="track-names" class="text-sm font-medium text-gray-600">Track names</label>
			<textarea
				id="track-names"
				bind:value={trackNames}
				disabled={loading}
				placeholder="A song on each line"
				rows="5"
				class="min-h-20 resize-y rounded border border-gray-300 bg-gray-100 p-3 font-inherit text-base focus:border-blue-600 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
			></textarea>
		</div>

		<div class="flex flex-col gap-2">
			<label for="common-keyword" class="text-sm font-medium text-gray-600">Common keyword</label>
			<input
				id="common-keyword"
				type="text"
				bind:value={commonKeyword}
				disabled={loading}
				placeholder="A common keyword"
				class="rounded border border-gray-300 bg-gray-100 p-3 font-inherit text-base focus:border-blue-600 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
			/>
		</div>

		<div class="flex justify-between">
			<button
				class="flex cursor-pointer items-center gap-2 rounded border border-blue-600 bg-white px-4 py-2 text-base text-blue-600 hover:bg-blue-600/5"
				onclick={reset}
			>
				<span>✕</span>
				Reset
			</button>

			<button
				class="flex cursor-pointer items-center gap-2 rounded border-none bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={loading}
				onclick={findTracks}
			>
				{#if loading}
					Loading...
				{:else}
					<span>🔍</span>
					Find
				{/if}
			</button>
		</div>
	</div>

	{#if tracks.length > 0}
		<div class="my-6 overflow-hidden rounded border border-gray-300">
			{#each tracks as track, idx (idx)}
				{#if track}
					<a
						href={track.external_urls.spotify}
						target="_blank"
						rel="noopener noreferrer"
						class="flex gap-4 border-b border-gray-300 p-3 text-inherit no-underline transition-colors last:border-b-0 hover:bg-gray-100"
					>
						<img
							src={track.album.images[0]?.url}
							alt={track.name}
							class="h-14 w-14 rounded object-cover"
						/>
						<div class="flex flex-1 flex-col justify-center gap-1">
							<div class="font-medium">{track.name}</div>
							<div class="text-sm text-gray-600">{track.artists.map((j) => j.name).join(', ')}</div>
						</div>
					</a>
				{:else}
					<div class="flex gap-4 border-b border-gray-300 p-3 text-gray-400 last:border-b-0">
						<div class="flex flex-1 flex-col justify-center gap-1">
							<div>[Couldn't find the track]</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<label for="playlist-name" class="text-sm font-medium text-gray-600">Playlist name</label>
			<input
				id="playlist-name"
				type="text"
				bind:value={playlistName}
				disabled={loading || tracks.filter((i) => i).length === 0}
				placeholder="Name for the new playlist"
				class="rounded border border-gray-300 bg-gray-100 p-3 font-inherit text-base focus:border-blue-600 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
			/>
		</div>

		{#if alertMessage}
			<div class="rounded border border-green-200 bg-green-100 p-3 text-green-800">
				Playlist
				<a
					href={alertMessage.url}
					target="_blank"
					rel="noopener noreferrer"
					class="font-medium underline"
				>
					{alertMessage.name}
				</a>
				has been created!
			</div>
		{/if}

		<div class="flex justify-end">
			<button
				class="flex cursor-pointer items-center gap-2 rounded border-none bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={loading || tracks.filter((i) => i).length === 0}
				onclick={createPlaylist}
			>
				{#if loading}
					Loading...
				{:else}
					<span>📤</span>
					Create
				{/if}
			</button>
		</div>
	</div>
</div>
