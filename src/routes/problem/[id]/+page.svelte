<script lang="ts">
	let { data } = $props();
</script>

<div class="flex flex-col p-2 gap-1">
	<div class="flex flex-col">
	<div class="text-xl">Problem</div>
	<div class="flex flex-row">
		<div class="justify-self-center text-center uppercase bg-[{data.problem.rgb}] border-[1px] border-black/50 rounded-sm w-8 h-6 mr-2">{data.problem.label}</div>
		{data.problem.name}</div>
</div>

{#if data.problem.color}
<div class="flex flex-col">
	<div class="text-xl">Color</div>
	<div>{data.problem.color}</div>
</div>
{/if}

{#if data.submissions && data.submissions.length > 0}
<div class="flex flex-col">
	<div class="text-xl">Submissions</div>
	<div>{data.submissions.length}</div>
</div>
{/if}
</div>