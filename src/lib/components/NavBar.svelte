<script lang="ts">
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import type { UserProfile } from '$lib/spotify';

	interface Props {
		user?: UserProfile;
	}

	let { user }: Props = $props();
	let menuOpen = $state(false);
</script>

<TopAppBar variant="static" color="primary">
	<Row>
		<Section>
			<Title>Spotify Playlist Generator</Title>
		</Section>
		<Section align="end" toolbar>
			{#if user}
				<div class="user-menu">
					<button
						class="icon-button"
						aria-label="User menu"
						onclick={() => (menuOpen = !menuOpen)}
					>
						{#if user.images.length > 0}
							<img
								src={user.images[0].url}
								alt={user.display_name || user.email || user.id}
								class="avatar"
							/>
						{/if}
					</button>
					{#if menuOpen}
						<div class="menu-dropdown">
							<a href="/api/logout" class="menu-item">Logout</a>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/api/login" class="login-link">Login</a>
			{/if}
		</Section>
	</Row>
</TopAppBar>

<style>
	:global(.mdc-top-app-bar) {
		background-color: #1976d2;
	}

	.user-menu {
		position: relative;
	}

	.icon-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.menu-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;
		background: white;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		min-width: 120px;
		z-index: 100;
	}

	.menu-item {
		display: block;
		padding: 0.75rem 1rem;
		color: #333;
		text-decoration: none;
	}

	.menu-item:hover {
		background-color: #f5f5f5;
	}

	.login-link {
		color: white;
		text-decoration: none;
		padding: 8px 16px;
	}
</style>
