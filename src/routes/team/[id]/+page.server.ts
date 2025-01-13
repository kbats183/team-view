import { error } from '@sveltejs/kit';
import { ContestUtil } from '$lib/contest-util';
import { contest } from '$lib/state.svelte.js';

export const load = async (params) => {
	const cc = contest
	if (!cc) throw error(404);

	if (!cc.getTeams())
		await cc.loadTeams();
	const teams = cc.getTeams();

	const team = teams?.find((t) => t.id && t.id === params.params.id);
	if (!team) throw error(404);

	if (!cc.getOrganizations())
		await cc.loadOrganizations();
	const orgs = cc.getOrganizations();

	const org = orgs?.find((o) => o.id === team.organization_id);

	if (!cc.getGroups())
		await cc.loadGroups();
	const groups = cc.getGroups();

	const groups2 = groups?.filter((g) => team.group_ids?.includes(g.id));

	const util = new ContestUtil();
	const logo = util.findById(orgs, team.organization_id)?.logo;

	if (!cc.getPersons())
		await cc.loadPersons();
	const persons = cc.getPersons();
	
	const coaches = persons?.filter((p) => p.role === 'coach' && p.team_ids?.includes(team.id));
	const contestants = persons?.filter(
		(p) => p.role === 'contestant' && p.team_ids?.includes(team.id)
	);

	//const submissions2 = await cc.loadSubmissions();
	if (!cc.getSubmissions())
		await cc.loadSubmissions();
	const submissions2 = cc.getSubmissions();

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
