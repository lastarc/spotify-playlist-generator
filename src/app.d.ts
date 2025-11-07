import type { UserProfile } from '$lib/spotify';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: UserProfile;
			access_token?: string;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
