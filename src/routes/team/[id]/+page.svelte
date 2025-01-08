<script lang="ts">
	import Person from '$lib/ui/Person.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col p-2 gap-1">
{#if data.organization}
<div class="flex flex-col">
	<div class="text-xl">Organization</div>
	<div>{data.organization.formal_name || data.organization.name}</div>
</div>
{/if}

{#if data.groups && data.groups.length > 0}
<div class="flex flex-col">
	<div class="text-xl">Groups</div>
	<div class="flex flex-row gap-2">
		{#each data.groups as group}
			<div>{group.name}</div>
		{/each}
	</div>
</div>
{/if}

{#if data.submissions && data.submissions.length > 0}
<div class="flex flex-col">
<div class="text-xl">Submissions</div>
{#each data.submissions as submission}
<div class="flex flex-row">{submission.contest_time}</div>
{/each}
</div>
{/if}

{#if data.coaches && data.coaches.length > 0}
<div class="flex flex-col">
	<div class="text-xl">Coaches</div>
	<div class="flex flex-row gap-2">
		{#each data.coaches as person}
			<Person {person} />
		{/each}
	</div>
</div>
{/if}

{#if data.contestants && data.contestants.length > 0}
<div class="flex flex-col">
	<div class="text-xl">Contestants</div>
	<div class="flex flex-row gap-2">
		{#each data.contestants as person}
			<Person {person} />
		{/each}
	</div>
</div>
{/if}
</div>