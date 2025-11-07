import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Spotify from '$lib/spotify';
import { config } from '$lib/config';

export const GET: RequestHandler = async ({ url }) => {
	const spotify = new Spotify({
		client_id: config.spotifyClientId,
		client_secret: config.spotifyClientSecret
	});

	const authUrl = spotify.authorization_url({
		scope: 'playlist-modify-public playlist-modify-private',
		redirect_uri: config.getReturnUri(url.origin)
	});

	throw redirect(302, authUrl);
};
