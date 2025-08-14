<script lang="ts">
	import type { ContestJSON } from '$lib/contest-types';
	import { ContestUtil } from '$lib/contest-util';
	import { onMount } from 'svelte';

	interface Props {
		contest?: ContestJSON;
	}

	let { contest }: Props = $props();
	let clock: string | undefined = $derived('?');

	const util = new ContestUtil();
	let state = $derived(util.getState(contest));

	onMount(() => {
		const clockInt = setInterval(
			() => {
				clock = util.getContestTime(contest, true);
			},
			contest && contest.time_multiplier ? 50 : 350
		);

		return () => {
			clearInterval(clockInt);
		};
	});
</script>

<span
    class:text-gray-400={state === 'unscheduled'}
    class:text-green-300={state === 'countdown'}
	class:text-blue-200={state === 'frozen'}
	class:text-gray-300={state === 'finished'}
	class:text-yellow-500={state === 'paused'}>
	{clock}
</span>
