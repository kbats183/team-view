<script lang="ts">
	import type { FileReferenceJSON, TeamJSON } from '$lib/contest-types';
	import Logo from '$lib/ui/Logo.svelte';

	export let data: {
		name: string;
		team: TeamJSON;
		logo: FileReferenceJSON[];
	};
</script>

<div class="w-full h-full overflow-hidden flex flex-col">
<div class="flex flex-row gap-4 bg-gray-700 text-white px-4 py-2 items-center">
	{#if data.logo}
	<div class="w-16 h-16">
	  <Logo ref={data.logo} size={16} />
	</div>
	{/if}

	<div>{data.team.id}</div>
	<div class="grow">{data.team.display_name || data.team.name}</div>

	<div class="flex flex-row gap-8">
		<div><a href="/team/{data.team.id}/webcam">Webcam</a></div>
		<div><a href="/team/{data.team.id}/desktop">Desktop</a></div>
		<div><a href="/team/{data.team.id}/pip">Picture in Picture</a></div>
		<div><a href="/team/{data.team.id}/details">Details</a></div>
	</div>
</div>

<div class="overflow-auto flex flex-col gap-4 p-2">
	<slot />
</div>
</div>