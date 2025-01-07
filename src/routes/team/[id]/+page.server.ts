import { error } from '@sveltejs/kit';
import { Contests } from '$lib/contests';
import { ContestUtil } from '$lib/contest-util';
import { CONTEST_URL } from '$lib/hardcoded';

export const load = async (params) => {
	const c = new Contests(CONTEST_URL);
	await c.loadContests();
	if (!c) throw error(404);

	const cc = c.getContest();
	if (!cc) throw error(404);

	const teams = await cc.loadTeams();
	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	const orgs = await cc.loadOrganizations();
	const org = orgs?.find((o) => o.id === team.organization_id);

	const groups = await cc.loadGroups();
	const groups2 = groups?.filter((g) => team.group_ids?.includes(g.id));

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	const persons = await cc.loadPersons();
	const coaches = persons?.filter((p) => p.role === 'coach' && p.team_ids?.includes(team.id));
	const contestants = persons?.filter(
		(p) => p.role === 'contestant' && p.team_ids?.includes(team.id)
	);

	const submissions2 = await cc.loadSubmissions();
	const submissions = submissions2?.filter(s => s.team_id === team.id);

	return {
		team: team,
		organization: org,
		groups: groups2,
		logo: logo,
		coaches: coaches,
		contestants: contestants,
		submissions: submissions,
		judgements: undefined,
		judgementTypes: undefined,
	};
};
