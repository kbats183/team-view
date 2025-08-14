/**
 * Copyright later.
 */
import type { Contest } from './contest';
import type { FileReferenceJSON, ProblemJSON, SubmissionJSON } from './contest-types';

export class ContestUtil {
	findById<Type extends { id: string }>(arr: Array<Type> | undefined, id: string | undefined): Type | undefined {
		if (!arr || arr.length === 0 || !id) {
			return undefined;
		}

		for (var i = 0; i < arr.length; i++) {
			if (id === arr[i].id) {
				return arr[i];
			}
		}
		return undefined;
	}

	findManyById<Type extends { id: string }>(arr: Array<Type> | undefined, ids: string | undefined): Array<Type> | undefined {
		if (!arr || arr.length === 0 || !ids || ids.length == 0) {
			return undefined;
		}

		var list = [];
		for (var j = 0; j < ids.length; j++) {
			for (var i = 0; i < arr.length; i++) {
				if (ids[j] === arr[i].id) {
					list.push(arr[i]);
				}
			}
		}
		return list;
	}

	findManyBySubmissionId<Type extends { submission_id: string }>(arr: Array<Type> | undefined, id: string | undefined): Array<Type> | undefined {
		if (!arr || arr.length === 0 || !id) {
			return undefined;
		}

		var list = [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].submission_id === id) {
				list.push(arr[i]);
			}
		}
		return list;
	}

	bestSquareLogo(
		logos: FileReferenceJSON[] | undefined,
		size: number
	): FileReferenceJSON | undefined {
		if (!logos || size < 1) {
			return undefined;
		}

		let best: FileReferenceJSON | undefined;
		for (var i = 0; i < logos.length; i++) {
			let ref = logos[i];
			if (ref.width != ref.height) {
				continue;
			}
			if (!best) {
				best = ref;
			} else if (best) {
				if (best.width && best.width < size && best.height && best.height < size) {
					// current best image is too small - is this one better (larger than current)?
					if ((ref.width && ref.width > best.width) || (ref.height && ref.height > best.height))
						best = ref;
					else if (best.width > size && best.height > size) {
						// current image is too big - is this one better (smaller but still big enough)?
						if ((ref.width && ref.width < best.width) || (ref.height && ref.height < best.height)) {
							if ((ref.width && ref.width >= size) || (ref.height && ref.height >= size))
								best = ref;
						}
					}
				}
			}
		}
		if (best != null) {
			return best;
		}
		return this.bestLogo(logos, size, size);
	}

	bestLogo(
		logos: FileReferenceJSON[] | undefined,
		width: number,
		height: number
	): FileReferenceJSON | undefined {
		if (!logos || width < 1 || height < 1) {
			return undefined;
		}

		let best: FileReferenceJSON | undefined;
		for (var i = 0; i < logos.length; i++) {
			let ref = logos[i];
			if (best == null) {
				best = ref;
			} else {
				if (best.width && best.width < width && best.height && best.height < height) {
					// current best image is too small - is this one better (larger than current)?
					if (
						(ref.width && best.width && ref.width > best.width) ||
						(ref.height && ref.height > best.height)
					)
						best = ref;
					else if (best.width > width && best.height > height) {
						// current image is too big - is this one better (smaller but still big enough)?
						if ((ref.width && ref.width < best.width) || (ref.height && ref.height < best.height)) {
							if ((ref.width && ref.width >= width) || (ref.height && ref.height >= height))
								best = ref;
						}
					}
				}
			}
		}
		return best;
	}

	isNumber(value: any): value is number {
		return typeof value === 'number';
	}

	parseRelTime(relTime: number | string): number | undefined {
		if (!relTime) {
			return undefined;
		}
		if (this.isNumber(relTime)) {
			// times were in minutes, but we want ms
			return relTime * 60 * 1000;
		}
		const match = relTime.match('-?([0-9]+):([0-9]{2}):([0-9]{2})(\\.[0-9]{3})?');

		if (match == null || match.length < 4) {
			return undefined;
		}

		const h = parseInt(match[1]);
		const m = parseInt(match[2]);
		const s = parseInt(match[3]);
		let ms = 0;
		if (match.length == 5) {
			ms = parseInt(match[4].substring(1));
		}

		const ret = h * 60 * 60 * 1000 + m * 60 * 1000 + s * 1000 + ms;
		if (relTime.startsWith('-')) {
			return -ret;
		}

		return ret;
	}

	formatTimeInMin(timeMs: number | undefined) {
		if (!timeMs) {
			return "";
		}
		if (timeMs >= 0 && timeMs < 1000)
			return "0";

		var sb = [];
		if (timeMs < 0) {
			sb.push("-");
			timeMs = -timeMs;
		}
		let timeS = Math.floor(timeMs / 1000);

		let mins = Math.floor(timeS / 60.0);
		if (mins > 0)
			sb.push(mins);

		return sb.join("");
	}

	isFirstToSolve(contest: Contest, submission: SubmissionJSON): boolean {
		const problem_id = submission.problem_id;
		const submissions = contest.getSubmissions();
		if (!submissions) {
			return false;
		}

		for (var i = 0; i < submissions.length; i++) {
			const time: number | string | undefined = this.parseRelTime(submissions[i].contest_time);
			if (time && time >= 0 && submissions[i].problem_id == problem_id) {
				// TODO: should we check if this is a public team too?
				const judgements = this.findManyBySubmissionId(contest.getJudgements(), submissions[i].id);
				if (judgements != null && judgements.length > 0) {
					const jt = this.findById(
						contest.getJudgementTypes(),
						judgements[judgements.length - 1].judgement_type_id
					);
					if (jt != null) {
						if (jt.solved) {
							if (submission == submissions[i]) return true;
							return false;
						}
					}
				}
			}
		}
		return false;
	}

	sortProblems(problems: ProblemJSON[]): any {
		return problems.sort((a, b) => (a.ordinal > b.ordinal ? 1 : b.ordinal > a.ordinal ? -1 : 0));
	}
}
