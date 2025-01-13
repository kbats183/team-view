import { Contests } from "./contests";
import { CONTEST_URL } from "./hardcoded";

const contestsImpl = new Contests(CONTEST_URL);

await contestsImpl.loadContests();

if (!contestsImpl) {
    console.log('error loading contests');
}

export const contests = contestsImpl;

export const contest = contests.getContest();
