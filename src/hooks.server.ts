import type { Handle } from '@sveltejs/kit';
import Spotify from '$lib/spotify';
import { config } from '$lib/config';

export const handle: Handle = async ({ event, resolve }) => {
	const access_token = event.cookies.get('access_token');
	const refresh_token = event.cookies.get('refresh_token');

	// Try to refresh the token if we have a refresh token but no access token
	if (refresh_token && !access_token) {
		try {
			const spotify = new Spotify({
				client_id: config.spotifyClientId,
				client_secret: config.spotifyClientSecret
			});

			const { access_token: new_access_token, expires_in } = await spotify.refresh_token({
				refresh_token
			});

			// Set the new access token
			event.cookies.set('access_token', new_access_token, {
				path: '/',
				httpOnly: true,
				secure: config.env === 'production',
				maxAge: expires_in
			});

			// Set the access token in locals for this request
			event.locals.access_token = new_access_token;
		} catch (e) {
			console.error("Token couldn't be refreshed", e);
		}
	} else if (access_token) {
		event.locals.access_token = access_token;
	}

	// Try to get the user profile if we have an access token
	if (event.locals.access_token) {
		try {
			const spotify = new Spotify({
				access_token: event.locals.access_token
			});
			event.locals.user = await spotify.get_profile();
		} catch (e) {
			// Access token invalid, do nothing
		}
	}

	return resolve(event);
};
