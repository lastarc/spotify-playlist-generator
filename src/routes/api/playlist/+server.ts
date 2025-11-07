import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Spotify from '$lib/spotify';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.access_token) {
		throw error(401, 'unauthorized');
	}

	const body = await request.json();

	if (typeof body.name !== 'string') {
		throw error(400, '`name` is absent in body');
	}

	if (typeof body.tracks !== 'string') {
		throw error(400, '`tracks` is absent in body');
	}

	let isPublic = false;
	if (body.isPublic === 'true') {
		isPublic = true;
	}

	const spotify = new Spotify({
		access_token: locals.access_token
	});

	const playlist = await spotify.create_playlist(body.name, undefined, isPublic);
	const addedTracks = await spotify.add_tracks_to_playlist(playlist.id, body.tracks.split(','));

	return json({ ...playlist, ...addedTracks });
};
