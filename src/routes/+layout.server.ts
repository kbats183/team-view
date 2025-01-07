import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { CONTEST_URL } from '$lib/hardcoded';

export const load = async (_params) => {
	const c = new Contests(CONTEST_URL);
	await c.loadContests();
	if (!c) throw error(404);

	const cc = c.getContest();
	if (!cc) throw error(404);

	const contest = c.getContests()[0];

	return {
		name: contest.formal_name || contest.name,
		banner: contest?.banner,
		logo: contest?.logo,
	};
};
