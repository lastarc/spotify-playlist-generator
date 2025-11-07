import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Spotify from '$lib/spotify';
import { config } from '$lib/config';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(500, 'Internal Server Error');
	}

	const spotify = new Spotify({
		client_id: config.spotifyClientId,
		client_secret: config.spotifyClientSecret
	});

	const { access_token, expires_in, refresh_token } = await spotify.get_tokens({
		code,
		redirect_uri: config.getReturnUri(url.origin)
	});

	cookies.set('access_token', access_token, {
		path: '/',
		httpOnly: true,
		secure: config.env === 'production',
		maxAge: expires_in
	});

	cookies.set('refresh_token', refresh_token, {
		path: '/',
		httpOnly: true,
		secure: config.env === 'production',
		maxAge: 6 * 30 * 24 * 60 * 60 // ~6 months
	});

	throw redirect(302, '/');
};
