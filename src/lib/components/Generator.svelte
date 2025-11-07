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
				fetch('/api/search?q=' + encodeURIComponent(i) + (keyword ? '+' + encodeURIComponent(keyword) : '')).then(
					(r) => r.json()
				)
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

<div class="generator">
	<div class="button-row">
		<button class="button-small" disabled={loading} onclick={removeClutter}>
			Remove clutter
		</button>
	</div>

	<div class="form-stack">
		<div class="form-group">
			<label for="track-names">Track names</label>
			<textarea
				id="track-names"
				bind:value={trackNames}
				disabled={loading}
				placeholder="A song on each line"
				rows="5"
			></textarea>
		</div>

		<div class="form-group">
			<label for="common-keyword">Common keyword</label>
			<input
				id="common-keyword"
				type="text"
				bind:value={commonKeyword}
				disabled={loading}
				placeholder="A common keyword"
			/>
		</div>

		<div class="button-row-between">
			<button class="button-outlined" onclick={reset}>
				<span class="icon">✕</span>
				Reset
			</button>

			<button class="button-contained" disabled={loading} onclick={findTracks}>
				{#if loading}
					Loading...
				{:else}
					<span class="icon">🔍</span>
					Find
				{/if}
			</button>
		</div>
	</div>

	{#if tracks.length > 0}
		<div class="track-list">
			{#each tracks as track, idx}
				{#if track}
					<a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" class="track-item">
						<img src={track.album.images[0]?.url} alt={track.name} class="track-image" />
						<div class="track-info">
							<div class="track-name">{track.name}</div>
							<div class="track-artists">{track.artists.map((j) => j.name).join(', ')}</div>
						</div>
					</a>
				{:else}
					<div class="track-item track-not-found">
						<div class="track-info">
							<div class="track-name">[Couldn't find the track]</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="form-stack">
		<div class="form-group">
			<label for="playlist-name">Playlist name</label>
			<input
				id="playlist-name"
				type="text"
				bind:value={playlistName}
				disabled={loading || tracks.filter((i) => i).length === 0}
				placeholder="Name for the new playlist"
			/>
		</div>

		{#if alertMessage}
			<div class="alert">
				Playlist
				<a
					href={alertMessage.url}
					target="_blank"
					rel="noopener noreferrer"
					style="text-decoration: underline;"
				>
					{alertMessage.name}
				</a>
				has been created!
			</div>
		{/if}

		<div class="button-row-right">
			<button
				class="button-contained"
				disabled={loading || tracks.filter((i) => i).length === 0}
				onclick={createPlaylist}
			>
				{#if loading}
					Loading...
				{:else}
					<span class="icon">📤</span>
					Create
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
	.generator {
		margin: 20px auto;
		width: 90vw;
		max-width: min(90vw, 450px);
	}

	.form-stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #555;
	}

	input,
	textarea {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		background-color: #f5f5f5;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #1976d2;
		background-color: white;
	}

	input:disabled,
	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.button-row {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 0.5rem;
	}

	.button-row-between {
		display: flex;
		justify-content: space-between;
	}

	.button-row-right {
		display: flex;
		justify-content: flex-end;
	}

	.button-small {
		padding: 0.25rem 0.75rem;
		font-size: 0.875rem;
		border: none;
		background: none;
		color: #1976d2;
		cursor: pointer;
		text-transform: uppercase;
	}

	.button-small:hover:not(:disabled) {
		background-color: rgba(25, 118, 210, 0.04);
	}

	.button-small:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.button-outlined {
		padding: 0.5rem 1rem;
		border: 1px solid #1976d2;
		background: white;
		color: #1976d2;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.button-outlined:hover:not(:disabled) {
		background-color: rgba(25, 118, 210, 0.04);
	}

	.button-contained {
		padding: 0.5rem 1rem;
		border: none;
		background: #1976d2;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.button-contained:hover:not(:disabled) {
		background-color: #1565c0;
	}

	.button-contained:disabled,
	.button-outlined:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.icon {
		display: inline-block;
	}

	.track-list {
		margin: 1.5rem 0;
		border: 1px solid #ddd;
		border-radius: 4px;
		overflow: hidden;
	}

	.track-item {
		display: flex;
		gap: 1rem;
		padding: 0.75rem;
		border-bottom: 1px solid #ddd;
		text-decoration: none;
		color: inherit;
		transition: background-color 0.2s;
	}

	.track-item:last-child {
		border-bottom: none;
	}

	.track-item:hover {
		background-color: #f5f5f5;
	}

	.track-not-found {
		color: #999;
	}

	.track-image {
		width: 56px;
		height: 56px;
		border-radius: 4px;
		object-fit: cover;
	}

	.track-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.25rem;
	}

	.track-name {
		font-weight: 500;
	}

	.track-artists {
		font-size: 0.875rem;
		color: #666;
	}

	.alert {
		padding: 0.75rem;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
		color: #155724;
	}

	.alert a {
		color: inherit;
		font-weight: 500;
	}
</style>
