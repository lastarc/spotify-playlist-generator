import { env } from '$env/dynamic/private';

export const config = {
	env: env.NODE_ENV || 'development',
	spotifyClientId: env.SPOTIFY_CLIENT_ID || '',
	spotifyClientSecret: env.SPOTIFY_CLIENT_SECRET || '',
	getReturnUri: (origin: string) => `${origin}/api/callback`
};
