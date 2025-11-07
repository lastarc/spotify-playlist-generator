import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Spotify from '$lib/spotify';

export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.access_token) {
		throw error(401, 'unauthorized');
	}

	const q = url.searchParams.get('q');
	if (!q) {
		throw error(400, '`q` parameter absent');
	}

	const spotify = new Spotify({
		access_token: locals.access_token
	});

	const result = await spotify.search(q);

	return json(result.tracks);
};
