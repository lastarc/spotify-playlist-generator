<script lang="ts">
	import type { UserProfile } from '$lib/spotify';

	interface Props {
		user?: UserProfile;
	}

	let { user }: Props = $props();
	let menuOpen = $state(false);
</script>

<nav class="navbar">
	<div class="container">
		<a href="/" class="logo">Spotify Playlist Generator</a>

		{#if user}
			<div class="user-menu">
				<button class="avatar-button" onclick={() => (menuOpen = !menuOpen)}>
					<img
						src={user.images.length > 0 ? user.images[0].url : ''}
						alt={user.display_name || user.email || user.id}
						class="avatar"
					/>
				</button>
				{#if menuOpen}
					<div class="menu-dropdown">
						<a href="/api/logout" class="menu-item">Logout</a>
					</div>
				{/if}
			</div>
		{:else}
			<a href="/api/login" class="login-button">Login</a>
		{/if}
	</div>
</nav>

<style>
	.navbar {
		background-color: #1976d2;
		color: white;
		padding: 1rem 0;
	}

	.container {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		color: white;
		text-decoration: none;
		font-size: 1.25rem;
		font-weight: 500;
	}

	.logo:hover {
		text-decoration: none;
	}

	.user-menu {
		position: relative;
	}

	.avatar-button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
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

	.login-button {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border: 1px solid white;
		border-radius: 4px;
	}

	.login-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
