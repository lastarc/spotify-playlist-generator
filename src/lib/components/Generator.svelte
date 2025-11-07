<script lang="ts">
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import Paper from '@smui/paper';
	import List, { Item, Text, PrimaryText, SecondaryText, Graphic } from '@smui/list';
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

<div class="container">
	<Paper elevation={0} style="padding: 20px; max-width: 450px; margin: 20px auto;">
		<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
			<Button variant="text" onclick={removeClutter} disabled={loading}>
				Remove clutter
			</Button>
		</div>

		<div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
			<Textfield
				textarea
				bind:value={trackNames}
				label="Track names"
				input$rows={5}
				style="width: 100%;"
				disabled={loading}
				input$placeholder="A song on each line"
			/>

			<Textfield
				bind:value={commonKeyword}
				label="Common keyword"
				style="width: 100%;"
				disabled={loading}
				input$placeholder="A common keyword"
			/>

			<div style="display: flex; justify-content: space-between;">
				<Button variant="outlined" onclick={reset}>
					<span style="margin-right: 8px;">✕</span>
					Reset
				</Button>

				<Button variant="raised" onclick={findTracks} disabled={loading}>
					{#if loading}
						Loading...
					{:else}
						<span style="margin-right: 8px;">🔍</span>
						Find
					{/if}
				</Button>
			</div>
		</div>

		{#if tracks.length > 0}
			<Paper elevation={1} style="margin: 24px 0;">
				<List>
					{#each tracks as track, idx (idx)}
						{#if track}
							<Item href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
								<Graphic>
									<img
										src={track.album.images[0]?.url}
										alt={track.name}
										style="width: 56px; height: 56px; border-radius: 4px; object-fit: cover;"
									/>
								</Graphic>
								<Text>
									<PrimaryText>{track.name}</PrimaryText>
									<SecondaryText>{track.artists.map((j) => j.name).join(', ')}</SecondaryText>
								</Text>
							</Item>
						{:else}
							<Item nonInteractive>
								<Text>
									<PrimaryText style="color: #999;">[Couldn't find the track]</PrimaryText>
								</Text>
							</Item>
						{/if}
					{/each}
				</List>
			</Paper>
		{/if}

		<div style="display: flex; flex-direction: column; gap: 16px;">
			<Textfield
				bind:value={playlistName}
				label="Playlist name"
				style="width: 100%;"
				disabled={loading || tracks.filter((i) => i).length === 0}
				input$placeholder="Name for the new playlist"
			/>

			{#if alertMessage}
				<Paper
					elevation={1}
					style="padding: 12px; background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724;"
				>
					Playlist
					<a
						href={alertMessage.url}
						target="_blank"
						rel="noopener noreferrer"
						style="color: inherit; font-weight: 500; text-decoration: underline;"
					>
						{alertMessage.name}
					</a>
					has been created!
				</Paper>
			{/if}

			<div style="display: flex; justify-content: flex-end;">
				<Button
					variant="raised"
					onclick={createPlaylist}
					disabled={loading || tracks.filter((i) => i).length === 0}
				>
					{#if loading}
						Loading...
					{:else}
						<span style="margin-right: 8px;">📤</span>
						Create
					{/if}
				</Button>
			</div>
		</div>
	</Paper>
</div>

<style>
	.container {
		width: 90vw;
		max-width: min(90vw, 450px);
		margin: 0 auto;
	}
</style>
