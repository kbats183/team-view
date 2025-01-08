<script lang="ts">
	import { ContestUtil } from '$lib/contest-util';
	import Logo from '$lib/ui/Logo.svelte';

	let { data } = $props();

	let cols: string[] = ['40px'];
	if (data.hasLogos) {
	  cols.push('40px');
	}
	cols.push('400px');

	cols.push('60px');
	cols.push('60px');

	data.problems.forEach(_p => cols.push('1fr'));

	let col = cols.join(' ');

	const util = new ContestUtil();
</script>

<div class="w-full text-sm p-2" role="table" aria-label="scoreboard">
	<!-- Table header -->
	<div role="rowgroup">
		<div
			role="row"
			class="grid grid-table gap-x-0.5 h-7 sticky top-0"
			style="grid-template-columns: {col}"
		>
			<div role="cell"></div>
			{#if data.hasLogos}
			<div role="cell"></div>
			{/if}
			<div role="cell"></div>
			<div role="cell" class="justify-self-center">Solved</div>
			<div role="cell" class="justify-self-center">Penalty</div>
			{#each data.problems as problem}
				<div role="cell" class="justify-self-center uppercase">{problem.label}</div>
			{/each}
		</div>
	</div>

	<!-- Table rows -->
	<div role="rowgroup">
		{#each data.scoreboard.rows as row, i}
			<div role="row" class="grid grid-table gapx-0.5 items-center h-9" style="grid-template-columns: {col}">
				<div role="cell" class="justify-self-end pr-1">{row.rank}</div>
				{#if data.hasLogos}
				<div role="cell" class="w-4 h-full justify-self-center"><Logo ref={data.logos[i]} /></div>
				{/if}
				<div role="cell"><a href="/team/{data.teams[i]?.id}">{data.teams[i]?.display_name || data.teams[i]?.name}</a></div>

				<div role="cell" class="justify-self-center text-xl">
					{row.score.num_solved && row.score.num_solved > 0 ? row.score.num_solved : ''}
				</div>
				<div role="cell" class="justify-self-center">
					{row.score.total_time ? util.formatTimeInMin(util.parseRelTime(row.score.total_time)) : ''}
					{row.score.score ? row.score.score : ''}
				</div>

				{#each data.problems as problem}
				  {@const rp = row.problems?.find(p => p.problem_id == problem.id)}
				  {#if rp}
					{#if rp.num_judged > 0}
						<div
							role="cell"
							class="text-center w-full h-full"
							class:bg-green-500={rp.solved || (rp.score && rp.score > 0)}
							class:bg-yellow-500={rp.num_pending > 0 && !rp.solved && (!rp.score || rp.score == 0)}
							class:bg-red-500={!rp.solved && rp.num_judged > 0 && rp.num_pending == 0}>
						<div>
							{rp.num_judged + rp.num_pending}
						</div>
						<div class="text-xs text-black/50">{rp.time ? util.formatTimeInMin(util.parseRelTime(rp.time)) : ''}</div>
						</div>
					{:else}
						<div role="cell"></div>
					{/if}
					{:else}
					  <div role="cell" class="text-center"></div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
