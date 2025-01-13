import { contests } from '$lib/state.svelte.js';
import { error } from '@sveltejs/kit';

export const load = async (_params) => {
	if (!contests) {
		throw error(404);
	}

	const contest = contests.getContests()[0];

	return {
		name: contest.formal_name || contest.name,
		banner: contest?.banner,
		logo: contest?.logo,
	};
};
